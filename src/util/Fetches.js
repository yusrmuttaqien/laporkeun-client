import axios from "axios";
import { toast } from "react-hot-toast";

import {
  GlobalStateFetches,
  GlobalStateLocation,
  GlobalStateSession,
  GlobalStateD,
} from "util/States";
import {
  compressIMG,
  dimensionIMG,
  md5Compare,
  multiImgURL,
} from "util/Helper";
import { database, storage } from "util/Firebase";

// Global fetch value
const sortSelect = [
  { value: "Acak", label: "Acak", isDisabled: true, id: 0 },
  { value: "Date DESC", label: "Terbaru", id: 1 },
  { value: "Date ASC", label: "Terlama", id: 2 },
];
const typeSelect = [
  { value: "Pilih tipe...", label: "Pilih tipe...", isDisabled: true, id: 0 },
  { value: "Saran", label: "Saran", id: 1 },
  { value: "Penting", label: "Penting", id: 2 },
];
const PaginationLimit = 10;

// Helper fetch function
function sortBy(map, sort) {
  let newArray = { ...map };
  newArray = JSON.parse(JSON.stringify(newArray));

  function dateOldNew(a, b) {
    if (a[1].acc_date < b[1].acc_date) return -1;
    if (a[1].acc_date > b[1].acc_date) return 1;
    if (a[1].lapor_date < b[1].lapor_date) return -1;
    if (a[1].lapor_date > b[1].lapor_date) return 1;
    return 0;
  }

  function dateNewOld(a, b) {
    if (a[1].acc_date < b[1].acc_date) return 1;
    if (a[1].acc_date > b[1].acc_date) return -1;
    if (a[1].lapor_date < b[1].lapor_date) return 1;
    if (a[1].lapor_date > b[1].lapor_date) return -1;
    return 0;
  }

  switch (sort.value) {
    case "Date DESC":
      newArray = Object.fromEntries(Object.entries(newArray).sort(dateNewOld));
      break;
    case "Date ASC":
      newArray = Object.fromEntries(Object.entries(newArray).sort(dateOldNew));
      break;
    default:
      break;
  }

  return newArray;
}

async function laporNewTemplate(report) {
  const {
    dLaporan,
    isPublic,
    locationKota,
    locationProv,
    picLaporan,
    sLaporan,
    type,
    thumbnail,
  } = report;
  const hashedUID = GlobalStateSession().getUIDUser();

  return {
    title: sLaporan,
    detail: dLaporan,
    type: typeSelect[type.id].value,
    pic: {
      webp: picLaporan ? `${picLaporan}.webp` : null,
      jpeg: picLaporan ? `${picLaporan}.jpeg` : null,
    },
    location: {
      prov: GlobalStateLocation().getLocationProv()[locationProv.id].value,
      kota: GlobalStateLocation().getLocationKota()[locationKota.id].value,
    },
    lapor_date: new Date().toISOString(),
    pengguna_uid: hashedUID,
    pengguna_name: GlobalStateSession().getName(),
    petugas_uid: null,
    petugas_name: null,
    respon_date: null,
    respon_detail: null,
    visibility: isPublic ? "Publik" : "Privat",
    status: "Menunggu",
    thumbnail,
  };
}

async function uploadMultiple(payload) {
  const storageLapor = storage.ref("/laporan");

  for (const param in payload) {
    await storageLapor
      .child(payload[param].name)
      .put(payload[param].file)
      .catch((err) => {
        return 0;
      });
  }

  return 1;
}

async function deleteMultiple(payload) {
  const storageLapor = storage.ref("/laporan");

  for (const param in payload) {
    await storageLapor
      .child(payload[param])
      .delete()
      .catch((err) => {
        return 0;
      });
  }

  return 1;
}

// Main fetches
async function FetchPetugas({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getPetugasPayload();
  const lastFetch = GlobalStateFetches().getPetugasLastFetch();
  const orderBy = GlobalStateFetches().getPetugasOrderBy();

  let petugases,
    realData = {};
  const databasePetugas = database
    .collection("users")
    .where("role", "==", "petugas")
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchPetugas({ action: "resetFetch" });
      break;
    case "resetFetch":
      petugases = await databasePetugas.get();
      petugases.docs.forEach((doc) => {
        realData[doc.data().name] = doc.data();
      });

      if (petugases.empty === true) {
        GlobalStateFetches().setPetugasPayload(null);
        GlobalStateFetches().setPetugasLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setPetugasOrderBy(0);
        }
      } else {
        GlobalStateFetches().setPetugasPayload(realData);
        GlobalStateFetches().setPetugasLastFetch(
          petugases.docs[petugases.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setPetugasOrderBy(0);
        }
      }
      break;
    case "moreFetch":
      petugases = await databasePetugas.startAfter(lastFetch).get();
      petugases.docs.forEach((doc) => {
        realData[doc.data().name] = doc.data();
      });

      GlobalStateFetches().addPetugasPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setPetugasOrderBy(0);
      }

      if (petugases.empty === true) {
        GlobalStateFetches().setPetugasLastFetch(0);
      } else {
        GlobalStateFetches().setPetugasLastFetch(
          petugases.docs[petugases.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setPetugasOrderBy(ext.id);
      GlobalStateFetches().setPetugasPayload(realData);
      break;
    case "closeFetch":
      await database
        .collection("users")
        .doc(ext.identify)
        .update({ suspended: !ext.suspended });

      GlobalStateFetches().addPetugasPayload((prev) => ({
        [ext.name]: {
          ...prev[ext.name],
          suspended: !ext.suspended,
        },
      }));
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchBuatLapor({ action, ext }) {
  const LocationAPI = axios.create({
    baseURL: "https://dev.farizdotid.com/api/daerahindonesia/",
  });
  const isProv = GlobalStateLocation().getLocationProv();
  const isKota = GlobalStateLocation().getLocationKota();
  const isKotaPersist = GlobalStateLocation().getLocationKotaPersist();

  let toData = {};
  let toSelect = [];

  switch (action) {
    case "effectFetch":
      if (isProv.length > 1) break;

      FetchBuatLapor({ action: "firstProvFetch" });
      break;
    case "firstProvFetch":
      const provinces = await LocationAPI.get("/provinsi");

      provinces.data.provinsi.map((data, index) => {
        toSelect.push({
          id_value: data.id,
          id_index: index + 1,
          label: data.nama,
          value: data.nama,
        });

        return 1;
      });

      GlobalStateLocation().setLocationProvSelect(toSelect);
      break;
    case "kotaFetch":
      // Check is city already persisted
      if (isKotaPersist) {
        if (isKotaPersist[ext.id]) {
          if (isKota.length === 1) {
            GlobalStateLocation().setLocationKotaSelectRest(
              isKotaPersist[ext.id]
            );
            break;
          }

          toSelect = JSON.parse(JSON.stringify(isKotaPersist[ext.id]));

          toSelect.unshift({
            value: "Kota...",
            label: "Kota...",
            isDisabled: true,
            id: 0,
          });

          GlobalStateLocation().setLocationKotaSelectZero(toSelect);
          break;
        }
      }

      const cities = await LocationAPI.get(`/kota?id_provinsi=${ext.id}`);

      // Put iterated data to main object based value id ~ object > array
      toData = {
        [ext.id]: cities.data.kota_kabupaten.map((data, index) => {
          return {
            id_value: data.id,
            id_index: index + 1,
            label: data.nama,
            value: data.nama,
          };
        }),
      };

      // Iterate for select ~ array
      cities.data.kota_kabupaten.map((data, index) => {
        toSelect.push({
          id_value: data.id,
          id_index: index + 1,
          label: data.nama,
          value: data.nama,
        });

        return 1;
      });

      if (isKota.length === 1) {
        GlobalStateLocation().setLocationKotaSelectRest(toSelect);
        GlobalStateLocation().setLocationKotaPersist(toData);
        break;
      }

      toSelect.unshift({
        value: "Kota...",
        label: "Kota...",
        isDisabled: true,
        id: 0,
      });

      GlobalStateLocation().setLocationKotaPersist(toData);
      GlobalStateLocation().setLocationKotaSelectZero(toSelect);
      break;
    case "submitLaporan":
      const loading = toast.loading("Mengunggah laporan");
      const databaseLaporan = database.collection("laporan");
      let imgDimension,
        imgWhat,
        imgWEBP,
        imgJPEG,
        imgBase64,
        imgName = null;

      if (ext.picLaporan[0]) {
        // Image processing
        imgDimension = await dimensionIMG(ext.picLaporan[0]);
        imgWhat =
          imgDimension.width > imgDimension.height
            ? { height: imgDimension.height % 2 === 0 ? 8 : 9 }
            : { width: imgDimension.width % 2 === 0 ? 8 : 9 };

        imgWEBP = await compressIMG({
          file: ext.picLaporan[0],
          ...imgDimension,
        });
        imgJPEG = await compressIMG({
          file: ext.picLaporan[0],
          ...imgDimension,
          format: "JPEG",
        });
        imgBase64 = await compressIMG({
          file: ext.picLaporan[0],
          ...imgWhat,
          quality: 50,
          format: "JPEG",
          output: "base64",
        });

        // Image name
        imgName =
          (await md5Compare(GlobalStateSession().getUID(), "users")) +
          new Date().getTime();
      }

      // Generate details
      const dataPush = await laporNewTemplate({
        ...ext,
        picLaporan: imgName || null,
        thumbnail: imgBase64 || null,
      });
      const imgPush = {
        webp: { name: `${imgName}.webp`, file: imgWEBP },
        jpeg: { name: `${imgName}.jpeg`, file: imgJPEG },
      };

      // Upload all
      try {
        await databaseLaporan.add(dataPush);
      } catch (err) {
        toast.error("Kesalahan unggah laporan");
        toast.error("Unggah laporan dibatalkan", { id: loading });
        break;
      }

      if (imgBase64) {
        if (!(await uploadMultiple(imgPush))) {
          toast.error("Kesalahan unggah gambar");
        }
      }

      toast.success("Laporan berhasil diunggah", { id: loading });
      ext.formReset();
      break;
    default:
      break;
  }
}

async function FetchLaporanku({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getLaporankuPayload();
  const lastFetch = GlobalStateFetches().getLaporankuLastFetch();
  const orderBy = GlobalStateFetches().getLaporankuOrderBy();
  const hashedUID = GlobalStateSession().getUIDUser();

  let laporanses,
    isEmpty,
    realData = {};
  const databaseLaporanku = database
    .collection("laporan")
    .where("pengguna_uid", "==", hashedUID)
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchLaporanku({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseLaporanku.get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      if (laporanses.empty === true) {
        GlobalStateFetches().setLaporankuPayload(null);
        GlobalStateFetches().setLaporankuLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporankuOrderBy(0);
        }
      } else {
        GlobalStateFetches().setLaporankuPayload(realData);
        GlobalStateFetches().setLaporankuLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporankuOrderBy(0);
        }
      }

      break;
    case "moreFetch":
      laporanses = await databaseLaporanku.startAfter(lastFetch).get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      GlobalStateFetches().addLaporankuPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setLaporankuOrderBy(0);
      }

      if (laporanses.empty === true) {
        GlobalStateFetches().setLaporankuLastFetch(0);
      } else {
        GlobalStateFetches().setLaporankuLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setLaporankuOrderBy(ext.id);
      GlobalStateFetches().setLaporankuPayload(realData);
      break;
    case "deleteFetch":
      const databaseLaporan = database.collection("laporan").doc(ext);
      const currentLaporan = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporankuPayload()[ext])
      );
      const loading = toast.loading("Menghapus laporan");

      laporanses = await databaseLaporan.get();
      laporanses = laporanses.data();

      if (laporanses.status !== "Menunggu") {
        toast.error("Laporan sudah diproses, muat ulang daftar");
        break;
      }

      try {
        await databaseLaporan.delete();
      } catch (error) {
        toast.error("Kesalahan hapus laporan");
        toast.error("Hapus laporan dibatalkan", { id: loading });
        break;
      }

      if (currentLaporan.thumbnail) {
        if (!(await deleteMultiple(currentLaporan.pic))) {
          toast.error("Kesalahan hapus gambar");
        }
      }

      await GlobalStateD().setResetD();
      await GlobalStateFetches().deleteLaporanku(ext);
      isEmpty = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporankuPayload())
      );
      isEmpty = Object.keys(isEmpty).length === 0;

      if (isEmpty) {
        GlobalStateFetches().setResetLaporanku();
      }

      toast.success("Laporan berhasil dihapus", { id: loading });
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchLaporanPublik({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getLaporanPublikPayload();
  const lastFetch = GlobalStateFetches().getLaporanPublikLastFetch();
  const orderBy = GlobalStateFetches().getLaporanPublikOrderBy();
  const hashedUID = GlobalStateSession().getUIDUser();

  let laporanses,
    isEmpty,
    realData = {};
  const databaseLaporanPublik = database
    .collection("laporan")
    .where("visibility", "==", "Publik")
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchLaporanPublik({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseLaporanPublik.get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      if (laporanses.empty === true) {
        GlobalStateFetches().setLaporanPublikPayload(null);
        GlobalStateFetches().setLaporanPublikLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporanPublikOrderBy(0);
        }
      } else {
        GlobalStateFetches().setLaporanPublikPayload(realData);
        GlobalStateFetches().setLaporanPublikLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporanPublikOrderBy(0);
        }
      }

      break;
    case "moreFetch":
      laporanses = await databaseLaporanPublik.startAfter(lastFetch).get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      GlobalStateFetches().addLaporanPublikPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setLaporanPublikOrderBy(0);
      }

      if (laporanses.empty === true) {
        GlobalStateFetches().setLaporanPublikLastFetch(0);
      } else {
        GlobalStateFetches().setLaporanPublikLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setLaporanPublikOrderBy(ext.id);
      GlobalStateFetches().setLaporanPublikPayload(realData);
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchDetails({ ext, action }) {
  let currentDetails;

  switch (action) {
    case "Laporanku":
      currentDetails = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporankuPayload()[ext])
      );

      if (!currentDetails.picURL && currentDetails.thumbnail) {
        const url = await multiImgURL(currentDetails.pic, "laporan");
        currentDetails.picURL = url;
        GlobalStateFetches().addLaporankuPayloadImgURL(currentDetails.id, {
          picURL: currentDetails.picURL,
        });
      }
      break;
    case "LaporanPublik":
      currentDetails = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporanPublikPayload()[ext])
      );

      if (!currentDetails.picURL && currentDetails.thumbnail) {
        const url = await multiImgURL(currentDetails.pic, "laporan");
        currentDetails.picURL = url;
        GlobalStateFetches().addLaporanPublikPayloadImgURL(currentDetails.id, {
          picURL: currentDetails.picURL,
        });
      }
      break;
    default:
      break;
  }
  await GlobalStateD().setData(currentDetails);
  return 1;
}

export {
  sortSelect,
  FetchPetugas,
  typeSelect,
  FetchBuatLapor,
  FetchLaporanku,
  FetchLaporanPublik,
  FetchDetails,
};
