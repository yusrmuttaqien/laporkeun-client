import { database, auth } from "util/Firebase";

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

async function checkNIK(NIK) {
  var isExist = {};
  await database
    .collection("users")
    .where("nik", "==", NIK)
    .get()
    .then((querySnapshot) => {
      isExist.stat = false;
      querySnapshot.forEach((doc) => {
        // check if NIK exist
        if (doc.data()) {
          isExist.stat = true;
          isExist.data = doc.data();
        }
      });
    })
    .catch((error) => {
      isExist.stat = "Kesalahan pengecekan NIK";
    });

  return isExist;
}

async function fetchUserData(email) {
  var details = {};

  await database
    .collection("users")
    .doc(email)
    .get()
    .then((doc) => {
      details = doc.data();
      details.isLogged = true;
      details.NIK = details.nik;
      // TODO: Handle users picURL
    })
    //  TODO: Handle this
    .catch((err) => console.log(err));

  return details;
}

async function regisPengguna(cred) {
  const { name, NIK, kataSandi } = cred;
  const usrCred = userNewTemplate({ NIK, name });
  var fakeEmail = name + "@laporkeun.com";
  fakeEmail = fakeEmail.toLowerCase();

  //   Check NIK
  const isExist = await checkNIK(NIK);
  if (isExist.stat) {
    return Promise.reject("NIK sudah terdaftar");
  } else if (isExist.stat === "Kesalahan pengecekan NIK") {
    return Promise.reject(isExist);
  }

  //   Create account & check name
  try {
    await auth.createUserWithEmailAndPassword(fakeEmail, kataSandi);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }

  //   Create account details
  try {
    await database.collection("users").doc(fakeEmail).set(usrCred);
    return Promise.resolve(`Akun ${name} berhasil dibuat`);
  } catch (err) {
    return Promise.reject(`Firebase err: ${err.code}`);
  }
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

async function logout() {
  await auth.signOut();
  return true;
}

export { regisPengguna, logout, fetchUserData, login };
