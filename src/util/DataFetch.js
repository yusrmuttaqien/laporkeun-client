import md5 from "md5";
import toast from "react-hot-toast";

import { database, auth, storage } from "util/Firebase";
import {
  GlobalStateSession,
  GlobalStateSD,
  SDTemplate,
  SessionTemplate,
} from "util/States";

// NOTE: Helper Function
function userNewTemplate(cred) {
  const { NIK, name } = cred;

  return {
    nik: NIK,
    pic: null,
    role: "pengguna",
    telp: null,
    acc_date: new Date().toISOString().split("T")[0],
    name,
  };
}

async function checkIsRegistered(toCompare) {
  var isExist = {};
  await database
    .collection("registered")
    .where("string", "==", toCompare)
    .get()
    .then((querySnapshot) => {
      isExist.stat = false;
      querySnapshot.forEach((doc) => {
        // check if NIK exist
        if (doc.data()) {
          isExist.stat = "NIK sudah terdaftar";
          isExist.data = doc.data();
        }
      });
    })
    .catch((error) => {
      console.log(error);
      isExist.stat = "Kesalahan pengecekan NIK (Firestore)";
    });

  return isExist;
}

function checkWithSession(data, sessionData) {
  const { name, telp, kataSandi, pic } = data;
  const { name: currName, telp: currTelp } = sessionData;
  const toChange = {};

  if (name !== currName) {
    toChange.name = name;
  }

  if (telp !== currTelp && telp !== "") {
    toChange.telp = telp;
  }

  if (kataSandi) {
    toChange.kataSandi = kataSandi;
  }

  if (pic[0]) {
    toChange.pic = pic[0];
  }

  return toChange;
}

async function md5Compare(data, mode = "registered") {
  var hash;

  if (mode === "registered") {
    hash = data + process.env.REACT_APP_HOT_KEY;
    hash = await md5(hash);
  }

  if (mode === "users") {
    hash = data + process.env.REACT_APP_SIGNATURE;
    hash = await md5(hash);
  }

  return hash;
}

// NOTE: Main Function
async function fetchUserData(uid) {
  const userId = await md5Compare(uid, "users");
  const storageProfile = storage.ref("/profile");
  var details = {};

  await database
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      details = doc.data();
      details.isLogged = true;
      details.NIK = details.nik;
      details.uid = uid;
    })
    //  TODO: Handle this, using linked toast perhaps?
    .catch((err) => console.log(err));

  if (details.pic) {
    details.picURL = await storageProfile.child(details.pic).getDownloadURL();
  }
  GlobalStateSession().setSession(details);
  return 0;
}

async function regisPengguna(cred) {
  const { name, NIK, kataSandi } = cred;
  const usrCred = userNewTemplate({ NIK, name });
  const toCompare = await md5Compare(NIK);
  var userId,
    fakeEmail = name + "@laporkeun.com";
  fakeEmail = fakeEmail.toLowerCase();

  //   Check NIK
  const isExist = await checkIsRegistered(toCompare);
  if (isExist.stat) {
    return Promise.reject(isExist.stat);
  } else if (isExist.stat === "Kesalahan pengecekan NIK") {
    return Promise.reject(isExist);
  }

  //   Create account & check name
  try {
    const UserDetails = await auth.createUserWithEmailAndPassword(
      fakeEmail,
      kataSandi
    );
    userId = await md5Compare(UserDetails.user.uid, "users");
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }

  //   Create account details & registered
  try {
    await database.collection("users").doc(userId).set(usrCred);
    await database.collection("registered").add({ string: toCompare });
    return Promise.resolve(`Akun ${name} berhasil dibuat`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
}

async function updateProfile(update) {
  const { data, sessionData } = update;
  const storageProfile = storage.ref("/profile");
  const databaseProfile = database.collection("users");
  const currUID = GlobalStateSession().getUID();
  const hashedCurrUID = await md5Compare(currUID, "users");
  const currPic = GlobalStateSession().getPic();
  var passChange,
    emailChange,
    dataChange = await checkWithSession(data, sessionData);

  // Nothing changes
  if (Object.keys(dataChange).length === 0) {
    return Promise.resolve("Tidak ada yang diubah :)");
  }

  // Alter password change if available
  if (dataChange.kataSandi) {
    passChange = dataChange.kataSandi;
    delete dataChange.kataSandi;
  }

  // Check if image changes
  if (dataChange.pic) {
    // Check there is old image
    if (currPic) {
      // Delete old pic
      await storageProfile
        .child(currPic)
        .delete()
        .then(() => toast.success("Foto lama terhapus"))
        .catch((err) => {
          return Promise.reject(`Firebase err: ${err.code}`);
        });
    }

    // Set new name
    var newName = `${hashedCurrUID}.${dataChange.pic.type.split("/")[1]}`;

    // Upload new image
    await storageProfile
      .child(newName)
      .put(dataChange.pic)
      .then(() => toast.success("Foto baru terunggah"))
      .catch((err) => {
        return Promise.reject(`Firebase err: ${err.code}`);
      });

    // Change file to filename
    dataChange.pic = newName;
  }

  // Update user details
  await databaseProfile
    .doc(hashedCurrUID)
    .update(dataChange)
    .then(() => toast.success("Detail akun berhasil diubah"))
    .catch((err) => {
      return Promise.reject(`Firebase err: ${err.code}`);
    });

  // NOTE: Wwatchout this code, it's janky
  // Update email & password if available
  if (dataChange.name) {
    emailChange = dataChange.name.toLowerCase() + "@laporkeun.com";
    await auth.currentUser
      .updateEmail(emailChange)
      .then(() => toast.success("Nama berhasil diubah"))
      .catch((err) => {
        return Promise.reject(`Firebase err: ${err.code}`);
      });
  }

  if (passChange) {
    await auth.currentUser
      .updatePassword(passChange)
      .then(() => toast.success("Kata sandi berhasil diubah"))
      .catch((err) => {
        return Promise.reject(`Firebase err: ${err.code}`);
      });
  }

  await fetchUserData(currUID);
  return Promise.resolve("Akun berhasil diperbarui");
}

async function login(cred) {
  const { name, kataSandi } = cred;
  const fakeEmail = name.toLowerCase() + "@laporkeun.com";

  try {
    await auth.signInWithEmailAndPassword(fakeEmail, kataSandi);
    return Promise.resolve(`Selamat datang, ${name}`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
}

async function deleteAccount(data) {
  console.log(data);
}

async function logout() {
  await GlobalStateSD().setSD(SDTemplate);
  await GlobalStateSession().setSession(SessionTemplate);
  await auth.signOut();
  return 0;
}

export {
  regisPengguna,
  logout,
  fetchUserData,
  login,
  updateProfile,
  deleteAccount,
};
