import axios from "axios";
import { toast } from "react-hot-toast";

import {
  GlobalStateFetches,
  GlobalStateLocation,
  GlobalStateSession,
  GlobalStateD,
} from "util/States";
import {
  md5Compare,
  multiImgURL,
  imgProcessing,
  uploadMultipleIMG,
  deleteMultipleIMG,
  uidAccDateChecker,
  getTime,
  getUnixEpooch,
} from "util/Helper";
import { database } from "util/Firebase";

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
    lapor_date: getTime(),
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
      let allIMG,
        imgName = null;

      if (ext.picLaporan[0]) {
        allIMG = await imgProcessing(ext.picLaporan[0], "buatLapor");

        // Image name
        imgName =
          (await md5Compare(GlobalStateSession().getUID(), "users")) +
          getUnixEpooch();
      }

      // Generate details
      const dataPush = await laporNewTemplate({
        ...ext,
        picLaporan: imgName || null,
        thumbnail: allIMG?.imgBase64 || null,
      });

      // Upload all
      try {
        await databaseLaporan.add(dataPush);
      } catch (err) {
        toast.error("Kesalahan unggah laporan");
        toast.error("Unggah laporan dibatalkan", { id: loading });
        break;
      }

      if (allIMG?.imgBase64) {
        const imgPush = {
          webp: { name: `${imgName}.webp`, file: allIMG.imgWEBP },
          jpeg: { name: `${imgName}.jpeg`, file: allIMG.imgJPEG },
        };

        if (!(await uploadMultipleIMG(imgPush, "buatLapor"))) {
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

  await GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchLaporanku({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseLaporanku.get();
      laporanses.docs.forEach((doc) => {
        if (uidAccDateChecker(doc.data().lapor_date, doc.data().pengguna_uid)) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
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
        if (uidAccDateChecker(doc.data().lapor_date, doc.data().pengguna_uid)) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
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
      const databaseLaporan = database.collection("laporan").doc(ext.id);
      let currentLaporan;

      if (ext.origin === "laporanPublik") {
        currentLaporan = JSON.parse(
          JSON.stringify(GlobalStateFetches().getLaporanPublikPayload()[ext.id])
        );
      } else {
        currentLaporan = JSON.parse(
          JSON.stringify(GlobalStateFetches().getLaporankuPayload()[ext.id])
        );
      }

      const loading = toast.loading("Menghapus laporan");

      laporanses = await databaseLaporan.get();
      laporanses = laporanses.data();

      if (laporanses.status !== "Menunggu") {
        toast.error("Laporan sudah diproses, muat ulang daftar", {
          id: loading,
        });
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
        if (!(await deleteMultipleIMG(currentLaporan.pic, "deleteLapor"))) {
          toast.error("Kesalahan hapus gambar");
        }
      }

      await GlobalStateD().setResetD();
      await GlobalStateFetches().deleteLaporanku(ext.id);
      await GlobalStateFetches().deleteLaporanPublik(ext.id);

      isEmpty = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporankuPayload())
      );

      if (!isEmpty || Object.keys(isEmpty).length === 0) {
        GlobalStateFetches().setResetLaporanku();
      }

      isEmpty = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporanPublikPayload())
      );

      if (!isEmpty || Object.keys(isEmpty).length === 0) {
        GlobalStateFetches().setResetLaporanPublik();
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

  let laporanses,
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

async function FetchLaporanBaru({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getLaporanBaruPayload();
  const lastFetch = GlobalStateFetches().getLaporanBaruLastFetch();
  const orderBy = GlobalStateFetches().getLaporanBaruOrderBy();
  const hashedUID = GlobalStateSession().getUIDUser();
  const name = GlobalStateSession().getName();

  let laporanses,
    loading,
    databaseLaporan,
    realData = {};
  const databaseLaporanBaru = database
    .collection("laporan")
    .where("status", "in", ["Menunggu", "Diproses"])
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchLaporanBaru({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseLaporanBaru.get();
      laporanses.docs.forEach((doc) => {
        if (
          doc.data().status === "Diproses" &&
          uidAccDateChecker(
            doc.data().respon_date.diproses,
            doc.data().petugas_uid
          )
        ) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }

        if (doc.data().status === "Menunggu") {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
      });

      if (laporanses.empty === true || Object.keys(realData).length === 0) {
        GlobalStateFetches().setLaporanBaruPayload(null);
        GlobalStateFetches().setLaporanBaruLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporanBaruOrderBy(0);
        }
      } else {
        GlobalStateFetches().setLaporanBaruPayload(realData);
        GlobalStateFetches().setLaporanBaruLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setLaporanBaruOrderBy(0);
        }
      }

      break;
    case "moreFetch":
      laporanses = await databaseLaporanBaru.startAfter(lastFetch).get();
      laporanses.docs.forEach((doc) => {
        if (
          doc.data().status === "Diproses" &&
          uidAccDateChecker(
            doc.data().respon_date.diproses,
            doc.data().petugas_uid
          )
        ) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }

        if (doc.data().status === "Menunggu") {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
      });

      GlobalStateFetches().addLaporanBaruPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setLaporanBaruOrderBy(0);
      }

      if (laporanses.empty === true) {
        GlobalStateFetches().setLaporanBaruLastFetch(0);
      } else {
        GlobalStateFetches().setLaporanBaruLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setLaporanBaruOrderBy(ext.id);
      GlobalStateFetches().setLaporanBaruPayload(realData);
      break;
    case "asDiproses":
      loading = toast.loading("Mengubah status laporan");

      databaseLaporan = database.collection("laporan").doc(ext);

      try {
        laporanses = await databaseLaporan.get();
        laporanses = laporanses.data();
      } catch (err) {
        toast.error(`Firebase err: ${err.code}`, {
          id: loading,
        });
        break;
      }

      if (laporanses.status !== "Menunggu") {
        toast.error("Laporan sudah diproses, muat ulang daftar", {
          id: loading,
        });
        break;
      }

      try {
        let payload = {
          status: "Diproses",
          petugas_uid: hashedUID,
          petugas_name: name,
          respon_date: { diproses: getTime() },
        };
        await databaseLaporan.update(payload);
        await GlobalStateD().setResetD();
        await GlobalStateFetches().addLaporanBaruPayloadUpdate(ext, payload);
        toast.success(`Status laporan diubah`, {
          id: loading,
        });
      } catch (err) {
        toast.error(`Firebase err: ${err.code}`, {
          id: loading,
        });
      }

      break;
    case "asResponse":
      loading = toast.loading("Menyelesaikan laporan");
      const currID = GlobalStateD().getData().id;

      databaseLaporan = database.collection("laporan").doc(currID);

      try {
        let payload = {
          status: ext.submitter,
          [`respon_date.${ext.submitter.toLowerCase()}`]: getTime(),
          petugas_uid: hashedUID,
          petugas_name: name,
          respon_detail: ext.resLaporan,
        };
        await databaseLaporan.update(payload);
        await GlobalStateFetches().deleteLaporanBaru(currID);
        await GlobalStateD().setResetD();
        toast.success(`Laporan selesai`, {
          id: loading,
        });
      } catch (err) {
        toast.error(`Firebase err: ${err.code}`, {
          id: loading,
        });
      }
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchTanggapanku({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getTanggapankuPayload();
  const lastFetch = GlobalStateFetches().getTanggapankuLastFetch();
  const orderBy = GlobalStateFetches().getTanggapankuOrderBy();

  let laporanses,
    realData = {};
  const databaseTanggapanku = database
    .collection("laporan")
    .where("status", "in", ["Ditolak", "Diterima"])
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchTanggapanku({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseTanggapanku.get();
      laporanses.docs.forEach((doc) => {
        if (
          uidAccDateChecker(
            doc.data().respon_date[doc.data().status.toLowerCase()],
            doc.data().petugas_uid
          )
        ) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
      });

      if (laporanses.empty === true || Object.keys(realData).length === 0) {
        GlobalStateFetches().setTanggapankuPayload(null);
        GlobalStateFetches().setTanggapankuLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setTanggapankuOrderBy(0);
        }
      } else {
        GlobalStateFetches().setTanggapankuPayload(realData);
        GlobalStateFetches().setTanggapankuLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setTanggapankuOrderBy(0);
        }
      }

      break;
    case "moreFetch":
      laporanses = await databaseTanggapanku.startAfter(lastFetch).get();
      laporanses.docs.forEach((doc) => {
        if (
          uidAccDateChecker(
            doc.data().respon_date[doc.data().status.toLowerCase()],
            doc.data().petugas_uid
          )
        ) {
          realData[doc.id] = doc.data();
          realData[doc.id] = { ...realData[doc.id], id: doc.id };
        }
      });

      GlobalStateFetches().addTanggapankuPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setTanggapankuOrderBy(0);
      }

      if (laporanses.empty === true) {
        GlobalStateFetches().setTanggapankuLastFetch(0);
      } else {
        GlobalStateFetches().setTanggapankuLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setTanggapankuOrderBy(ext.id);
      GlobalStateFetches().setTanggapankuPayload(realData);
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchSemuaTanggapan({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getSemuaTanggapanPayload();
  const lastFetch = GlobalStateFetches().getSemuaTanggapanLastFetch();
  const orderBy = GlobalStateFetches().getSemuaTanggapanOrderBy();

  let laporanses,
    realData = {};
  const databaseSemuaTanggapan = database
    .collection("laporan")
    .where("status", "in", ["Ditolak", "Diterima"])
    .limit(PaginationLimit);

  GlobalStateFetches().setLoading(true);

  switch (action) {
    case "effectFetch":
      if (doneFirstFetch) break;

      FetchSemuaTanggapan({ action: "resetFetch" });
      break;
    case "resetFetch":
      laporanses = await databaseSemuaTanggapan.get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      if (laporanses.empty === true || Object.keys(realData).length === 0) {
        GlobalStateFetches().setSemuaTanggapanPayload(null);
        GlobalStateFetches().setSemuaTanggapanLastFetch(0);

        if (orderBy !== 0) {
          GlobalStateFetches().setSemuaTanggapanOrderBy(0);
        }
      } else {
        GlobalStateFetches().setSemuaTanggapanPayload(realData);
        GlobalStateFetches().setSemuaTanggapanLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );

        if (orderBy !== 0) {
          GlobalStateFetches().setSemuaTanggapanOrderBy(0);
        }
      }

      break;
    case "moreFetch":
      laporanses = await databaseSemuaTanggapan.startAfter(lastFetch).get();
      laporanses.docs.forEach((doc) => {
        realData[doc.id] = doc.data();
        realData[doc.id] = { ...realData[doc.id], id: doc.id };
      });

      GlobalStateFetches().addSemuaTanggapanPayload(realData);

      if (orderBy !== 0) {
        GlobalStateFetches().setSemuaTanggapanOrderBy(0);
      }

      if (laporanses.empty === true) {
        GlobalStateFetches().setSemuaTanggapanLastFetch(0);
      } else {
        GlobalStateFetches().setSemuaTanggapanLastFetch(
          laporanses.docs[laporanses.docs.length - 1] || 0
        );
      }
      break;
    case "sortFetch":
      realData = await sortBy(doneFirstFetch, ext);

      GlobalStateFetches().setSemuaTanggapanOrderBy(ext.id);
      GlobalStateFetches().setSemuaTanggapanPayload(realData);
      break;
    default:
      break;
  }

  GlobalStateFetches().setLoading(false);
}

async function FetchDetails({ action, ext }) {
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
    case "LaporanBaru":
      currentDetails = JSON.parse(
        JSON.stringify(GlobalStateFetches().getLaporanBaruPayload()[ext])
      );

      if (!currentDetails.picURL && currentDetails.thumbnail) {
        const url = await multiImgURL(currentDetails.pic, "laporan");
        currentDetails.picURL = url;
        GlobalStateFetches().addLaporanBaruPayloadUpdate(currentDetails.id, {
          picURL: currentDetails.picURL,
        });
      }
      break;
    case "Tanggapanku":
      currentDetails = JSON.parse(
        JSON.stringify(GlobalStateFetches().getTanggapankuPayload()[ext])
      );

      if (!currentDetails.picURL && currentDetails.thumbnail) {
        const url = await multiImgURL(currentDetails.pic, "laporan");
        currentDetails.picURL = url;
        GlobalStateFetches().addTanggapankuPayloadUpdate(currentDetails.id, {
          picURL: currentDetails.picURL,
        });
      }
      break;
    case "SemuaTanggapan":
      currentDetails = JSON.parse(
        JSON.stringify(GlobalStateFetches().getSemuaTanggapanPayload()[ext])
      );

      if (!currentDetails.picURL && currentDetails.thumbnail) {
        const url = await multiImgURL(currentDetails.pic, "laporan");
        currentDetails.picURL = url;
        GlobalStateFetches().addSemuaTanggapanPayloadUpdate(currentDetails.id, {
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
  FetchLaporanBaru,
  FetchTanggapanku,
  FetchSemuaTanggapan,
};
