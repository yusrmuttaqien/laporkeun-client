import * as yup from "yup";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const SchemaDaftar = yup.object().shape({
  NIK: yup
    .number()
    .required("NIK wajib diisi")
    .test("len", "NIK wajib 16 angka", (val) => val.toString().length === 16)
    .typeError("NIK harus berupa angka")
    .positive("NIK berupa bilangan positif")
    .integer("NIK berupa bilangan bulat"),
  name: yup
    .string()
    .required("Nama wajib diisi")
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
  name: yup.string().required("Nama wajib diisi"),
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

export { SchemaDaftar, SchemaMasuk, SchemaLaporan, SchemaTanggapan };
