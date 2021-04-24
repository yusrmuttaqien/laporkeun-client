import { createState, useState } from "@hookstate/core";

// NOTE: Helper
const SessionTemplate = {
  isLogged: false,
  role: null,
  name: null,
  NIK: null,
  pic: null,
  picURL: null,
  telp: null,
};

const PopupTemplate = {
  stats: false,
  message: null,
  mode: "notify",
  txtYes: "Ok",
  txtNo: "Cancel" 
};

const PPWrapper = (s) => ({
  setMsg: (msg) => s.message.set(msg),
  setMode: (mode) => s.mode.set(mode),
  setPopup: (stats) => s.stats.set(stats),
  setCallback: (cb) => s.callback.set(cb),
  settxtYes: (txt) => s.txtYes.set(txt),
  settxtNo: (txt) => s.txtNo.set(txt),
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
  mode: "notify",
  txtYes: "Ok",
  txtNo: "Cancel" 
};

// NOTE: Initialize state
const DataInstance = createState(DataState);
const SDInstance = createState(SideDetailState);
const PPInstance = createState(PopupState);

// NOTE: Non-component state
const GlobalStatePopup = () => PPWrapper(PPInstance);

export {
  SessionTemplate,
  PopupTemplate,
  DataInstance,
  SDInstance,
  PPInstance,
  GlobalStatePopup,
};
