import { toast } from "react-hot-toast";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { database, auth, authSecondary } from "util/Firebase";
import { TriggerLoading } from "util/Loading";
import {
  md5Compare,
  multiImgURL,
  imgProcessing,
  uploadMultipleIMG,
  deleteMultipleIMG,
  getTime,
} from "util/Helper";
import {
  GlobalStateSession,
  GlobalStateD,
  GlobalStateLookup,
  GlobalStateFetches,
  GlobalStateUI,
} from "util/States";

// Helper Function
function userNewTemplate(cred) {
  const { nik, name } = cred;

  return {
    nik,
    pic: null,
    role: "pengguna",
    telp: null,
    acc_date: getTime(),
    name,
  };
}

function petugasNewTemplate(cred) {
  const { telp, name, userId } = cred;

  return {
    nik: userId,
    pic: null,
    role: "petugas",
    telp: telp,
    acc_date: getTime(),
    name,
    suspended: false,
  };
}

async function checkIsRegistered(toCompare) {
  let isExist = {};
  await getDocs(
    query(collection(database, "registered"), where("string", "==", toCompare))
  )
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

async function reAuthenticate(key) {
  const currFakeEmailPrefix = GlobalStateSession().getName();
  const credential = EmailAuthProvider.credential(
    currFakeEmailPrefix.toLowerCase() + "@laporkeun.com",
    key
  );

  return await reauthenticateWithCredential(auth.currentUser, credential);
}

// Main Function
async function authCheck() {
  TriggerLoading({ stats: true, message: "Memuat akun" });

  await onAuthStateChanged(auth, async (user) => {
    if (user) {
      await fetchUserData(user.uid);
      TriggerLoading({ stats: false });
    } else {
      await cleaning();
      if (GlobalStateUI().getLoading()) {
        TriggerLoading({ stats: false });
      }
    }
  });
}

async function fetchUserData(uid) {
  const userId = await md5Compare(uid, "users");
  const getLookup = JSON.parse(JSON.stringify(GlobalStateLookup().getLookup()));
  let details = {};

  await getDoc(doc(database, "users", userId))
    .then((doc) => {
      details = doc.data();
      details.isLogged = true;
      details.uid = uid;
      details.hashedUsrUID = userId;
    })
    //  TODO: Handle this, using linked toast perhaps?
    .catch((err) => {
      console.log(err);
      return 0;
    });

  // Checking session with lookup state
  if (getLookup.deggoLsi) {
    if (getLookup.elor !== details.role) {
      await logout();
      toast.error("Data sesi tidak valid");
      return 0;
    }
  } else {
    GlobalStateLookup().setLookup({
      deggoLsi: true,
      elor: details.role,
    });
  }

  if (details.suspended) {
    await logout();
    toast.error("Akun ini ditutup");
    return 0;
  }

  if (details.pic) {
    details.picURL = await multiImgURL(details.pic, "profile");
  }
  GlobalStateSession().setSession(details);
  return 1;
}

async function regisPengguna(cred) {
  const { name, NIK: nik, kataSandi } = cred;
  const usrCred = userNewTemplate({ nik, name });
  const toCompare = await md5Compare(nik);
  let userId,
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
    const UserDetails = await createUserWithEmailAndPassword(
      auth,
      fakeEmail,
      kataSandi
    );
    userId = await md5Compare(UserDetails.user.uid, "users");
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code} 1`);
  }

  //   Create account details & registered
  try {
    await setDoc(doc(database, "users", userId), usrCred);
    await addDoc(collection(database, "registered"), { string: toCompare });
    return Promise.resolve(`Akun ${name} berhasil dibuat`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code} 2`);
  }
}

async function regisPetugas(cred) {
  const { name, telp, kataSandi } = cred;
  let userId,
    usrCred,
    fakeEmail = name + "@laporkeun.com";
  fakeEmail = fakeEmail.toLowerCase();

  //   Create account & check name
  try {
    const UserDetails = await createUserWithEmailAndPassword(
      authSecondary,
      fakeEmail,
      kataSandi
    );
    userId = await md5Compare(UserDetails.user.uid, "users");
    usrCred = await petugasNewTemplate({ telp, name, userId });
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }

  //   Create account details & registered
  try {
    await setDoc(doc(database, "users", userId), usrCred);
    await signOut(authSecondary);
    return Promise.resolve(`Akun ${name} berhasil dibuat`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
}

async function updateProfile(update) {
  const { data, sessionData, key } = update;

  // User reauthenticate
  try {
    await reAuthenticate(key);
  } catch (err) {
    console.log(err)
    return Promise.reject(`Firebase err: ${err.code}`);
  }

  const currUID = GlobalStateSession().getUID();
  const hashedCurrUID = GlobalStateSession().getUIDUser();
  const currPic = GlobalStateSession().getPic();
  let passChange,
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
      try {
        await deleteMultipleIMG(currPic, "profile");
        toast.success("Foto lama terhapus");
      } catch (err) {
        return Promise.reject(`Firebase err: ${err.code}`);
      }
    }

    // Set new name
    let allIMG,
      imgPackage,
      newName = hashedCurrUID;

    allIMG = await imgProcessing(dataChange.pic, "profile");

    imgPackage = {
      webp: { name: `${newName}.webp`, file: allIMG.imgWEBP },
      png: { name: `${newName}.png`, file: allIMG.imgPNG },
    };

    // Upload new image
    try {
      await uploadMultipleIMG(imgPackage, "profile");
      toast.success("Foto baru terunggah");
    } catch (err) {
      console.log(err)
      return Promise.reject(`Firebase err: ${err.code}`);
    }

    // Change file to filename
    dataChange.pic = {
      webp: `${newName}.webp`,
      png: `${newName}.png`,
    };
  }

  // Update email & password if available
  if (dataChange.name) {
    emailChange = dataChange.name.toLowerCase() + "@laporkeun.com";
    await updateEmail(auth.currentUser, emailChange)
      .then(() => toast.success("Nama berhasil diubah"))
      .catch((err) => {
        return Promise.reject(`Firebase err: ${err.code}`);
      });
  }

  if (passChange) {
    await updatePassword(auth.currentUser, passChange)
      .then(() => toast.success("Kata sandi berhasil diubah"))
      .catch((err) => {
        return Promise.reject(`Firebase err: ${err.code}`);
      });
  }

  // Update user details
  await updateDoc(doc(database, "users", hashedCurrUID), dataChange)
    .then(() => toast.success("Detail akun berhasil diubah"))
    .catch((err) => {
      return Promise.reject(`Firebase err: ${err.code}`);
    });

  await fetchUserData(currUID);
  return Promise.resolve(
    dataChange.pic
      ? "Akun berhasil diperbarui, muat ulang halaman"
      : "Akun berhasil diperbarui"
  );
}

async function login(cred) {
  const { name, kataSandi } = cred;
  const fakeEmail = name.toLowerCase() + "@laporkeun.com";

  try {
    await signInWithEmailAndPassword(auth, fakeEmail, kataSandi);
    return Promise.resolve(`Selamat datang, ${name}`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
}

async function deleteAccount(key) {
  const currPic = GlobalStateSession().getPic();
  const currNIK = GlobalStateSession().getNIK();
  const hashedCurrUID = GlobalStateSession().getUIDUser();
  const toCompare = await md5Compare(currNIK);

  // User reauthenticate
  try {
    await reAuthenticate(key);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }

  // Check if there is image
  if (currPic) {
    try {
      await deleteMultipleIMG(currPic, "profile");
      toast.success("Foto terhapus");
    } catch (err) {
      return Promise.reject(`Firebase err: ${err.code}`);
    }
  }

  // Delete user detail
  await deleteDoc(doc(database, "users", hashedCurrUID))
    .then(() => toast.success("Detail akun dihapus"))
    .catch((err) => {
      return Promise.reject(`Firebase err: ${err.code}`);
    });

  // Delete registered
  await getDocs(
    query(collection(database, "registered"), where("string", "==", toCompare))
  )
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .catch((err) => {
      return Promise.reject(`Firebase err: ${err.code}`);
    });

  // Delete account
  await deleteUser(auth.currentUser)
    .then(() => {
      toast.success("Auth berhasil diputus");
    })
    .catch((err) => {
      return Promise.reject(`Firebase err: ${err.code}`);
    });

  await logout();
  return Promise.resolve("Akun berhasil dihapus");
}

async function deleteIMGProfile() {
  const currPic = GlobalStateSession().getPic();
  const hashedCurrUID = GlobalStateSession().getUIDUser();
  let dataChange = { pic: null };

  try {
    await deleteMultipleIMG(currPic, "profile");
    await updateDoc(doc(database, "users", hashedCurrUID), dataChange);

    return Promise.resolve("Foto terhapus, muat ulang halaman");
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
}

async function cleaning() {
  await GlobalStateD().setResetD();
  GlobalStateLookup().setLookup({
    deggoLsi: false,
    elor: null,
  });
  await GlobalStateSession().setResetSession();
  await GlobalStateFetches().setResetAll();

  return 1;
}

async function logout() {
  await signOut(auth);
  await cleaning();
  return 1;
}

export {
  authCheck,
  regisPengguna,
  regisPetugas,
  logout,
  fetchUserData,
  login,
  updateProfile,
  deleteAccount,
  deleteIMGProfile,
};
