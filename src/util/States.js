import { createState, none } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

// Template
const SessionTemplate = {
  isLogged: false,
  role: null,
  name: null,
  nik: null,
  pic: null,
  picURL: null,
  telp: null,
  uid: null,
  hashedUsrUID: null,
};

const PopupTemplate = {
  stats: false,
  message: null,
  form: false,
  txtYes: null,
  txtNo: null,
  txtLabel: null,
};

const FetchesTemplate = {
  isLoading: false,
  petugas: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  laporanku: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  laporanPublik: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  laporanBaru: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  tanggapanku: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
};

const DTemplate = { stats: false, data: null, loading: false };

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
  setResetSession: () => s.session.set(SessionTemplate),
  getIsLogged: () => s.session.isLogged.get(),
  getUID: () => s.session.uid.get(),
  getPic: () => s.session.pic.get(),
  getName: () => s.session.name.get(),
  getNIK: () => s.session.nik.get(),
  getUIDUser: () => s.session.hashedUsrUID.get(),
  getDate: () => s.session.acc_date.get(),
});

const DWrapper = (s) => ({
  setD: (stats) => s.stats.set(stats),
  setResetD: () => s.merge(DTemplate),
  setLoading: (loading) => s.loading.set(loading),
  setData: (data) => s.data.set(data),
  getD: () => s.stats.get(),
  getData: () => s.data.get(),
});

const UIWrapper = (s) => ({
  setLoading: (loading) => s.loading.stats.set(loading),
  getLoading: () => s.loading.stats.get(),
  setLoadingMsg: (msg) => s.loading.message.set(msg),
});

const LookupWrapper = (s) => ({
  getLookup: () => s.get(),
  setLookup: (lookup) => s.set(lookup),
});

const FetchesWrapper = (s) => ({
  // Global
  setLoading: (loading) => s.isLoading.set(loading),
  setResetAll: () => {
    s.petugas.payload.set(null);
    s.laporanku.payload.set(null);
    s.laporanPublik.payload.set(null);
    s.laporanBaru.payload.set(null);
    s.tanggapanku.payload.set(null);
    s.petugas.set(FetchesTemplate.petugas);
    s.laporanku.set(FetchesTemplate.laporanku);
    s.laporanPublik.set(FetchesTemplate.laporanPublik);
    s.laporanBaru.set(FetchesTemplate.laporanBaru);
    s.tanggapanku.set(FetchesTemplate.tanggapanku);
  },

  // Petugas
  getPetugasPayload: () => s.petugas.payload.get(),
  getPetugasLastFetch: () => s.petugas.lastFetch.get(),
  getPetugasOrderBy: () => s.petugas.orderBy.get(),
  setPetugasOrderBy: (order) => s.petugas.orderBy.set(order),
  setPetugasPayload: (payload) => s.petugas.payload.set(payload),
  setPetugasLastFetch: (lastfetch) => s.petugas.lastFetch.set(lastfetch),
  addPetugasPayload: (payload) => s.petugas.payload.merge(payload),

  // Laporanku
  getLaporankuPayload: () => s.laporanku.payload.get(),
  getLaporankuLastFetch: () => s.laporanku.lastFetch.get(),
  getLaporankuOrderBy: () => s.laporanku.orderBy.get(),
  setLaporankuOrderBy: (order) => s.laporanku.orderBy.set(order),
  setLaporankuPayload: (payload) => s.laporanku.payload.set(payload),
  setLaporankuLastFetch: (lastfetch) => s.laporanku.lastFetch.set(lastfetch),
  addLaporankuPayload: (payload) => s.laporanku.payload.merge(payload),
  addLaporankuPayloadImgURL: (id, url) => s.laporanku.payload[id].merge(url),
  deleteLaporanku: (id) =>
    s.laporanku.payload[id] && s.laporanku.payload[id].set(none),
  setResetLaporanku: () =>
    s.laporanku.set({ orderBy: 0, payload: null, lastFetch: 0 }),

  // LaporanPublik
  getLaporanPublikPayload: () => s.laporanPublik.payload.get(),
  getLaporanPublikLastFetch: () => s.laporanPublik.lastFetch.get(),
  getLaporanPublikOrderBy: () => s.laporanPublik.orderBy.get(),
  setLaporanPublikOrderBy: (order) => s.laporanPublik.orderBy.set(order),
  setLaporanPublikPayload: (payload) => s.laporanPublik.payload.set(payload),
  setLaporanPublikLastFetch: (lastfetch) =>
    s.laporanPublik.lastFetch.set(lastfetch),
  addLaporanPublikPayload: (payload) => s.laporanPublik.payload.merge(payload),
  addLaporanPublikPayloadImgURL: (id, url) =>
    s.laporanPublik.payload[id].merge(url),
  deleteLaporanPublik: (id) =>
    s.laporanPublik.payload[id] && s.laporanPublik.payload[id].set(none),
  setResetLaporanPublik: () =>
    s.laporanPublik.set({ orderBy: 0, payload: null, lastFetch: 0 }),

  // LaporanBaru
  getLaporanBaruPayload: () => s.laporanBaru.payload.get(),
  getLaporanBaruLastFetch: () => s.laporanBaru.lastFetch.get(),
  getLaporanBaruOrderBy: () => s.laporanBaru.orderBy.get(),
  setLaporanBaruOrderBy: (order) => s.laporanBaru.orderBy.set(order),
  setLaporanBaruPayload: (payload) => s.laporanBaru.payload.set(payload),
  setLaporanBaruLastFetch: (lastfetch) =>
    s.laporanBaru.lastFetch.set(lastfetch),
  addLaporanBaruPayload: (payload) => s.laporanBaru.payload.merge(payload),
  addLaporanBaruPayloadUpdate: (id, url) =>
    s.laporanBaru.payload[id].merge(url),
  deleteLaporanBaru: (id) =>
    s.laporanBaru.payload[id] && s.laporanBaru.payload[id].set(none),
  setResetLaporanBaru: () =>
    s.laporanBaru.set({ orderBy: 0, payload: null, lastFetch: 0 }),

  // Tanggapanku
  getTanggapankuPayload: () => s.tanggapanku.payload.get(),
  getTanggapankuLastFetch: () => s.tanggapanku.lastFetch.get(),
  getTanggapankuOrderBy: () => s.tanggapanku.orderBy.get(),
  setTanggapankuOrderBy: (order) => s.tanggapanku.orderBy.set(order),
  setTanggapankuPayload: (payload) => s.tanggapanku.payload.set(payload),
  setTanggapankuLastFetch: (lastfetch) =>
    s.tanggapanku.lastFetch.set(lastfetch),
  addTanggapankuPayload: (payload) => s.tanggapanku.payload.merge(payload),
  addTanggapankuPayloadUpdate: (id, url) =>
    s.tanggapanku.payload[id].merge(url),
  deleteTanggapanku: (id) =>
    s.tanggapanku.payload[id] && s.tanggapanku.payload[id].set(none),
  setResetTanggapanku: () =>
    s.tanggapanku.set({ orderBy: 0, payload: null, lastFetch: 0 }),
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
    nik: null,
    pic: null,
    picURL: null,
    telp: null,
    uid: null,
    hashedUsrUID: null,
  },
};

const DetailsState = { stats: false, data: null, loading: false };

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
  laporanku: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  laporanPublik: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  laporanBaru: {
    orderBy: 0,
    payload: null,
    lastFetch: 0,
  },
  tanggapanku: {
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
const DInstance = createState(DetailsState);
const PPInstance = createState(PopupState);
const UIInstance = createState(UIState);
const LookupInstance = createState(LookupState);
const FetchesInstance = createState(FetchesData);
const LocationInstance = createState(LocationData);

// Set persistance
LookupInstance.attach(Persistence("noisses"));

// Non-component state import
const GlobalStatePopup = () => PPWrapper(PPInstance);
const GlobalStateSession = () => DataWrapper(DataInstance);
const GlobalStateD = () => DWrapper(DInstance);
const GlobalStateUI = () => UIWrapper(UIInstance);
const GlobalStateLookup = () => LookupWrapper(LookupInstance);
const GlobalStateFetches = () => FetchesWrapper(FetchesInstance);
const GlobalStateLocation = () => LocationWrapper(LocationInstance);

// Component state import

export {
  SessionTemplate,
  PopupTemplate,
  DTemplate,
  DataInstance,
  DInstance,
  PPInstance,
  UIInstance,
  LookupInstance,
  FetchesInstance,
  LocationInstance,
  GlobalStatePopup,
  GlobalStateSession,
  GlobalStateD,
  GlobalStateUI,
  GlobalStateLookup,
  GlobalStateFetches,
  GlobalStateLocation,
};
