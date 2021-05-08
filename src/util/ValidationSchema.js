import * as yup from "yup";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// Schema .test(), return true for pass, return false for fail

const SchemaDaftar = yup.object().shape({
  NIK: yup
    .string()
    .required("NIK wajib diisi")
    .test("onlyNumber", "NIK berupa angka", (val) => /^\d+$/.test(val))
    .test(
      "length",
      "NIK wajib 16 angka",
      (val) => val.toString().length === 16
    ),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .test("noAdSign", "Hilangkan tanda '@'", (val) => !val.includes("@"))
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

const SchemaMasuk = yup.object().shape({
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .test("noAdSign", "Hilangkan tanda '@'", (val) => !val.includes("@")),
});

const SchemaLaporan = yup.object().shape({
  sLaporan: yup
    .string()
    .required("simpulan wajib diisi")
    .max(30, "simpulan maksimal 30 karakter"),
  dLaporan: yup
    .string()
    .required("detail wajib diisi")
    .max(2000, "detail maksimal 2000 karakter"),
  picLaporan: yup
    .mixed()
    .test("fileType", "Format gambar tidak didukung", (value) => {
      if (value.length !== 0 && !SUPPORTED_FORMATS.includes(value[0].type)) {
        return false;
      } else {
        return true;
      }
    })
    .test("fileSize", "Ukuran gambar melebihi 1MB", (value) => {
      if (value.length !== 0 && value[0].size >= FILE_SIZE) {
        return false;
      } else {
        return true;
      }
    }),
});

const SchemaTanggapan = yup.object().shape({
  responBalik: yup
    .string()
    .required("Respon wajib diisi")
    .max(2000, "Respon maksimal 2000 karakter"),
});

const SchemaDaftarPetugas = yup.object().shape({
  telp: yup
    .string()
    .test("benumber", "Telepon berupa angka", (val) => {
      if (val !== "" && !/^\d+$/.test(val)) {
        return false;
      } else {
        return true;
      }
    })
    .test("length", "Telepon antara 12 - 15 angka", (val) => {
      if (val !== "") {
        if (val.length >= 12 && val.length <= 15) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .test("noAdSign", "Hilangkan tanda '@'", (val) => !val.includes("@"))
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

const SchemaSetting = yup.object().shape({
  telp: yup
    .string()
    .test("benumber", "Telepon berupa angka", (val) => {
      if (val !== "" && !/^\d+$/.test(val)) {
        return false;
      } else {
        return true;
      }
    })
    .test("length", "Telepon antara 12 - 15 angka", (val) => {
      if (val !== "") {
        if (val.length >= 12 && val.length <= 15) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }),
  name: yup
    .string()
    .test("noAdSign", "Hilangkan tanda '@'", (val) => !val.includes("@"))
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .test("unsafe", "Kata sandi minimal 8 karakter", (val) => {
      if (val !== "" && val.length <= 8) {
        return false;
      } else {
        return true;
      }
    }),
  pic: yup
    .mixed()
    .test("fileType", "Format gambar tidak didukung", (value) => {
      if (value.length !== 0 && !SUPPORTED_FORMATS.includes(value[0].type)) {
        return false;
      } else {
        return true;
      }
    })
    .test(
      "fileAspectRatio",
      "Rasio gambar harus 1:1 / persegi",
      function AspectRatio(value) {
        if (value.length !== 0 && this.options.context.aspectRatio !== 1) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test("fileSize", "Ukuran gambar melebihi 1MB", (value) => {
      if (value.length !== 0 && value[0].size >= FILE_SIZE) {
        return false;
      } else {
        return true;
      }
    }),
});

const SchemaPopup = yup.object().shape({
  input: yup.string().required("Kolom wajib diisi"),
});

export {
  SchemaDaftar,
  SchemaMasuk,
  SchemaLaporan,
  SchemaTanggapan,
  SchemaDaftarPetugas,
  SchemaSetting,
  SchemaPopup,
};
