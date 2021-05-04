# Laporkeun Client

![laporkeun](src/asset/FullLogo.png)

Aplikasi Client laporkeun!

## Memulai penyiapan klien

1. Pastikan memiliki
> git cli

> Akun firebase

> NPM/Yarn 
2. Clone kode klien dengan `git clone https://github.com/DrDhemm/laporkeun-client.git` 
3. Masuk direktori dengan `cd laporkeun-client` 
4. Pastikan memiliki akun Firebase, lalu lakukan penyiapan berikut

    - Pada direktori `laporkeun-client/src/component`, buat folder baru bernama `util` dan buat file baru bernama `Firebase.js`
    - Salin kode konfigurasi dari projek firebase anda (berupa Obj Javascript) seperti contoh,
        ```
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        ```
    - Lalu susun isi file `Firebase.js` seperti berikut
        ```
        import firebase from "firebase/app";

        import "firebase/storage";

        const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        };

        firebase.initializeApp(firebaseConfig);
        const storage = firebase.storage();

        export { storage, firebase as default };
        ```
        - Lalu simpan
        - Note: ubah pengaturan CORS pada Firebase Storage menjadi terbuka untuk semua alamat, hal ini dilakukan jika klien dijalankan melalui localhost (untuk mengaktifkan fitur generate PDF sepenuhnya)

5. Pada direktori utama jalankan `npm i`
6. Setelah itu jalankan `npm start` atau lakukan `npm run build` lalu ikuti langkah pada terminal untuk menjalankan klien hasil build (untuk mendapatkan performa yang maksimal)
7. Note: Jalankan klien bersamaan dengan server

## Progress Client & Server laporkeun!
- Complete rough app UI (as desktop fullscreen size) ✔
- Form.jsx, figure out FormDaftar ✔
- Attach form validation ✔
- Attach notification ✔
- Attach EasyPeasy to app ✔
- Attach UI to state (global & local) ✔
- Add mini UI (Form Warning ✔, Entry empty, Loading content ✔, presistScroll, table header ✔)
- Add show short in LihatLaporan ✔
- Add toast control component ~ use promise based instead ✔
- Backend building (watchout pagination ✔, image uploading ✔)
- Axios ✔, CORS ✔, JWT ✔ (Refresh token)
- DB connecting (watchout structure ✔, Stored procedure ✔)
    - Route
        - Registrasi ✔ (Bcrypt ✔, auto login ✔)
        - Login ✔
- Session management (Logout ✔, Presist(onReload) ✔)
        - BuatLaporan ✔ (Upload image ✔)
        - LihatLaporan ✔ (user ✔, petugas ✔, admin ✔, Generate PDF ✔)
        - Response ✔
- Move DB to Firestore Database
- Add edit ✔, delete ✔ (profil ✔, Laporan ✔, petugas ✔)
- All, check min max size all components ✔
- Optimize image ✔
- Add support at 858px to all components
- Refactor CSS & JS
- Add support at mobile (707px) to all components
- Complete all UI elements responsive state

## Detail

- Klien dibuat menggunakan React.js menggunakan
  - create-react-app sebagai template bootstrap
  - styled-components sebagai layouting (native)
  - Firebase, layanan upload gambar
  - jsPDF sebagai generator PDF
- Klien dibuat oleh [drDhemm](https://github.com/DrDhemm). 2021

```

```
