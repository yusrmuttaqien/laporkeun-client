import { createState } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

// NOTE: Helper
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
  setMasuk: () => s.forms.set("Masuk"),
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
  setForms: (forms) => s.forms.set(forms),
  setLoading: (loading) => s.loading.stats.set(loading),
  setLoadingMsg: (msg) => s.loading.message.set(msg),
});

// NOTE: State
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
  forms: "Masuk",
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
  forms: "Masuk",
  loading: { stats: true, message: "Memuat" },
};

// NOTE: Initialize state
const DataInstance = createState(DataState);
const SDInstance = createState(SideDetailState);
const PPInstance = createState(PopupState);
const UIInstance = createState(UIState);

// NOTE: Set persistance
DataInstance.attach(Persistence("main-session"));

// NOTE: Non-component state
const GlobalStatePopup = () => PPWrapper(PPInstance);
const GlobalStateSession = () => DataWrapper(DataInstance);
const GlobalStateSD = () => SDWrapper(SDInstance);
const GlobalStateUI = () => UIWrapper(UIInstance);

export {
  SessionTemplate,
  PopupTemplate,
  SDTemplate,
  DataInstance,
  SDInstance,
  PPInstance,
  UIInstance,
  GlobalStatePopup,
  GlobalStateSession,
  GlobalStateSD,
  GlobalStateUI,
};
