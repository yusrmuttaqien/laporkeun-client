import { action, thunk } from "easy-peasy";

import firebase from "./util/Firebase";

export const state = {
  UI: {
    sideDetails: {
      onFocus: false,
    },
    formDefault: "Masuk",
  },
  session: {
    isLogged: false,
    role: null, //
    name: null, //
    NIK: null, //
    pic: null, //
    telp: null, //
  },
  activeDetail: {
    id_report: null, //
    id_petugas: null, //
    id_response: null, //
    pic: null, //
    title: null, //
    report: null, //
    date_report: null, //
    date_response: null, //
    vis: null, //
    stat: null, //
    response: null, //
    NIK: null, //
    name_pengguna: null, //
    name_petugas: null, //
  },
  listLaporan: [
    {
      id_report: null, //
      id_petugas: null, //
      title: null, //
      date_report: null, //
      date_response: null, //
      vis: null, //
      stat: null, //
      NIK: null, //
    },
  ],
  listPetugas: [
    {
      id_petugas: null, //
      name_petugas: null, //
      telp: null, //
      date_akun: null, //
    },
  ],

  // Thunk
  penggunaRegistration: thunk((actions, payload) => {
    return payload.name === "anak";
  }),

  // Action
  toggleFocusDetails: action((state) => {
    return {
      ...state,
      UI: {
        ...state.UI,
        sideDetails: {
          ...state.UI.sideDetails,
          onFocus: !state.UI.sideDetails.onFocus,
        },
      },
    };
  }),
  toggleFormDefault: action((state) => {
    return {
      ...state,
      UI: {
        ...state.UI,
        formDefault: state.UI.formDefault === "Masuk" ? "Daftar" : "Masuk",
      },
    };
  }),
};
