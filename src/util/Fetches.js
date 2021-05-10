import axios from "axios";

import { GlobalStateFetches, GlobalStateLocation } from "util/States";
import { database } from "util/Firebase";

// Global fetch value
const options = [
  { value: "Acak", label: "Acak", isDisabled: true, id: 0 },
  { value: "Date DESC", label: "Terbaru", id: 1 },
  { value: "Date ASC", label: "Terlama", id: 2 },
];
const tipeLaporan = [
  { value: "Pilih tipe...", label: "Pilih tipe...", isDisabled: true, id: 0 },
  { value: "Saran", label: "Saran", id: 1 },
  { value: "Penting", label: "Penting", id: 2 },
];
const PaginationLimit = 10;

// Helper fetch function
function sortBy(map, sort) {
  var newArray = { ...map };
  newArray = JSON.parse(JSON.stringify(newArray));

  function dateOldNew(a, b) {
    if (a[1].acc_date < b[1].acc_date) return -1;
    if (a[1].acc_date > b[1].acc_date) return 1;
    return 0;
  }

  function dateNewOld(a, b) {
    if (a[1].acc_date < b[1].acc_date) return 1;
    if (a[1].acc_date > b[1].acc_date) return -1;
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

// Main fetches
async function FetchPetugas({ action, ext }) {
  const doneFirstFetch = GlobalStateFetches().getPetugasPayload();
  const lastFetch = GlobalStateFetches().getPetugasLastFetch();
  const orderBy = GlobalStateFetches().getPetugasOrderBy();

  var petugases,
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

  var toData = {};
  var toSelect = [];

  switch (action) {
    case "effectFetch":
      if (isProv.length > 1) break;

      FetchBuatLapor({ action: "firstProvFetch" });
      break;
    case "firstProvFetch":
      console.log("fetching prov")
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
          console.log("use persist kota")
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
      console.log("fetching kota")

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
    default:
      break;
  }
}

export { options, FetchPetugas, tipeLaporan, FetchBuatLapor };
