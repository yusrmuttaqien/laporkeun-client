import { createState } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

// Template
const SessionTemplate = {
  isLogged: false,
  role: null,
  name: null,
  NIK: null,
  pic: null,
  picURL: null,
  telp: null,
  uid: null,
};

const PopupTemplate = {
  stats: false,
  message: null,
  form: false,
  txtYes: null,
  txtNo: null,
  txtLabel: null,
};

const SDTemplate = {
  stats: false,
  payload: { id: null, nik: null, petugas: null },
  newResponseByIDReport: null,
};

// Helper
const PPWrapper = (s) => ({
  setMsg: (msg) => s.message.set(msg),
  setForm: (form) => s.form.set(form),
  setLabel: (label) => s.txtLabel.set(label),
  setPopup: (stats) => s.stats.set(stats),
  setCallback: (cb) => s.callback.set(cb),
  settxtYes: (txt) => s.txtYes.set(txt),
  settxtNo: (txt) => s.txtNo.set(txt),
});

const DataWrapper = (s) => ({
  setSession: (sesObj) => s.session.set(sesObj),
  getIsLogged: () => s.session.isLogged.get(),
  getUID: () => s.session.uid.get(),
  getPic: () => s.session.pic.get(),
  getName: () => s.session.name.get(),
  getNIK: () => s.session.NIK.get(),
});

const SDWrapper = (s) => ({
  setSD: (SDObj) => s.set(SDObj),
});

const UIWrapper = (s) => ({
  setLoading: (loading) => s.loading.stats.set(loading),
  setLoadingMsg: (msg) => s.loading.message.set(msg),
});

const LookupWrapper = (s) => ({
  getLookup: () => s.get(),
  setLookup: (lookup) => s.set(lookup),
});

const FetchesWrapper = (s) => ({
  // Global
  setLoading: (loading) => s.isLoading.set(loading),

  // Petugas
  getPetugasPayload: () => s.petugas.payload.get(),
  getPetugasLastFetch: () => s.petugas.lastFetch.get(),
  getPetugasOrderBy: () => s.petugas.orderBy.get(),
  setPetugasOrderBy: (order) => s.petugas.orderBy.set(order),
  setPetugasPayload: (payload) => s.petugas.payload.set(payload),
  setPetugasLastFetch: (lastfetch) => s.petugas.lastFetch.set(lastfetch),
  addPetugasPayload: (payload) => s.petugas.payload.merge(payload),
});

const LocationWrapper = (s) => ({
  // Province
  getLocationProv: () => s.locationProv.get(),
  setLocationProvSelect: (prov) => s.locationProv.merge(prov),

  // City
  getLocationKota: () => s.locationKota.get(),
  getLocationKotaPersist: () => s.locationKotaPersist.get(),
  setLocationKotaPersist: (kota) => s.locationKotaPersist.merge(kota),
  setLocationKotaSelectRest: (kota) => s.locationKota.merge(kota),
  setLocationKotaSelectZero: (kota) => s.locationKota.set(kota),
});

// State
const DataState = {
  session: {
    isLogged: false,
    role: null,
    name: null,
    NIK: null,
    pic: null,
    picURL: null,
    telp: null,
    uid: null,
  },
};

const SideDetailState = {
  stats: false,
  payload: { id: null, nik: null, petugas: null },
  newResponseByIDReport: null,
};

const PopupState = {
  stats: false,
  message: null,
  form: false,
  txtYes: null,
  txtNo: null,
  txtLabel: null,
};

const UIState = {
  loading: { stats: true, message: "Memuat" },
};

const LookupState = {
  deggoLsi: false,
  elor: null,
};

const FetchesData = {
  isLoading: false,
  petugas: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
};

const LocationData = {
  locationProv: [
    { value: "Provinsi...", label: "Provinsi...", isDisabled: true, id: 0 },
  ],

  locationKotaPersist: null,

  locationKota: [
    { value: "Kota...", label: "Kota...", isDisabled: true, id: 0 },
  ],
};

// Initialize state
const DataInstance = createState(DataState);
const SDInstance = createState(SideDetailState);
const PPInstance = createState(PopupState);
const UIInstance = createState(UIState);
const LookupInstance = createState(LookupState);
const FetchesInstance = createState(FetchesData);
const LocationInstance = createState(LocationData);

// Set persistance
LocationInstance.attach(Persistence("location"));
LookupInstance.attach(Persistence("noisses"));

// Non-component state import
const GlobalStatePopup = () => PPWrapper(PPInstance);
const GlobalStateSession = () => DataWrapper(DataInstance);
const GlobalStateSD = () => SDWrapper(SDInstance);
const GlobalStateUI = () => UIWrapper(UIInstance);
const GlobalStateLookup = () => LookupWrapper(LookupInstance);
const GlobalStateFetches = () => FetchesWrapper(FetchesInstance);
const GlobalStateLocation = () => LocationWrapper(LocationInstance);

// Component state import

export {
  SessionTemplate,
  PopupTemplate,
  SDTemplate,
  DataInstance,
  SDInstance,
  PPInstance,
  UIInstance,
  LookupInstance,
  FetchesInstance,
  LocationInstance,
  GlobalStatePopup,
  GlobalStateSession,
  GlobalStateSD,
  GlobalStateUI,
  GlobalStateLookup,
  GlobalStateFetches,
  GlobalStateLocation,
};
