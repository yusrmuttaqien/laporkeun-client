import { database, auth } from "util/Firebase";

function userNewTemplate(NIK) {
  return {
    nik: NIK,
    pic: "",
    role: "pengguna",
    telp: "",
    acc_date: new Date().toISOString().split("T")[0],
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
  const name = email.split("@")[0];
  var details;

  await database
    .collection("users")
    .doc(email)
    .get()
    .then((doc) => {
      details = doc.data();
      details.isLogged = true;
      details.name = name;
      details.NIK = details.nik
    })
    .catch((err) => console.log(err));

  return details;
}

async function regisPengguna(cred) {
  const { name, NIK, kataSandi } = cred;
  const usrCred = userNewTemplate(NIK);
  const fakeEmail = name + "@laporkeun.com";

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
    if (err.code === "auth/email-already-in-use") {
      return Promise.reject("Nama sudah dipakai");
    }
    return Promise.reject("Kesalahan mendaftarkan akun");
  }

  //   Create account details
  try {
    await database.collection("users").doc(fakeEmail).set(usrCred);
    return Promise.resolve("Akun berhasil dibuat");
  } catch (err) {
    return Promise.reject("Kesalahan menambahkan detail akun");
  }
}

async function logout() {
  await auth.signOut();
  return true;
}

export { regisPengguna, logout, fetchUserData };
