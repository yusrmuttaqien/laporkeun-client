import * as yup from "yup";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// NOTE: Schema .test(), return true for pass, return false for fail

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
  judulLaporan: yup
    .string()
    .required("Judul wajib diisi")
    .max(30, "Judul maksimal 30 karakter"),
  loc: yup
    .string()
    .required("Lokasi wajib diisi")
    .max(30, "Lokasi maksimal 30 karakter"),
  isiLaporan: yup
    .string()
    .required("Isi wajib diisi")
    .max(2000, "Isi maksimal 2000 karakter"),
  pic: yup
    .mixed()
    .test("fileType", "Unsupported File Format", (value) => {
      if (value.length !== 0 && !SUPPORTED_FORMATS.includes(value[0].type)) {
        return false;
      } else {
        return true;
      }
    })
    .test("fileSize", "File Size is too large", (value) => {
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
    .number()
    .required("Nomor wajib diisi")
    .test("len", "Nomor minimal 10 digit", (val) => val.toString().length >= 10)
    .test(
      "lenmin",
      "Nomor maksimal 15 digit",
      (val) => val.toString().length <= 15
    )
    .typeError("Nomor harus berupa angka")
    .positive("Nomor berupa bilangan positif")
    .integer("Nomor berupa bilangan bulat"),
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
    .test("fileType", "Format tidak didukung", (value) => {
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
    .test("fileSize", "File Size is too large", (value) => {
      if (value.length !== 0 && value[0].size >= FILE_SIZE) {
        return false;
      } else {
        return true;
      }
    }),
});

export {
  SchemaDaftar,
  SchemaMasuk,
  SchemaLaporan,
  SchemaTanggapan,
  SchemaDaftarPetugas,
  SchemaSetting,
};
