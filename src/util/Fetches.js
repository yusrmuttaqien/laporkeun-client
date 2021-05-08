import { GlobalStateFetches } from "util/States";
import { database } from "util/Firebase";

// Global fetch value
const options = [
  { value: "Acak", label: "Acak", isDisabled: true, id: 0 },
  { value: "Date DESC", label: "Terbaru", id: 1 },
  { value: "Date ASC", label: "Terlama", id: 2 },
];
const tipeLaporan = [
  { value: "Pilih...", label: "Pilih...", isDisabled: true, id: 0 },
  { value: "Saran", label: "Saran", id: 1 },
  { value: "Penting", label: "Penting", id: 2 },
];
const lokasi = [
  { value: "Pilih...", label: "Pilih...", isDisabled: true, id: 0 },
  { value: "Malang", label: "Malang", id: 1 },
  { value: "Surabaya", label: "Surabaya", id: 2 },
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
      if (doneFirstFetch) {
        console.log("not fetching");
        break;
      }

      console.log("fetching");
      FetchPetugas({ action: "resetFetch" });

      break;
    case "resetFetch":
      console.log("resetFetch");

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
      console.log("moreFetch");

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

export { options, FetchPetugas, tipeLaporan, lokasi };
