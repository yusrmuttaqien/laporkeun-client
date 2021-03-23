import axios from "axios";
import { action, thunk, persist } from "easy-peasy";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
});

export const state = {
  UI: {
    sideDetails: {
      onFocus: false,
    },
    formDefault: "Masuk",
  },
  session: persist({
    isLogged: false,
    role: null,
    name: null,
    NIK: null,
    pic: null,
    telp: null,
    token: null,
  }),
  activeDetail: {
    id_report: null,
    id_petugas: null,
    id_response: null,
    pic: null,
    title: null,
    report: null,
    date_report: null,
    date_response: null,
    vis: null,
    stat: null,
    response: null,
    NIK: null,
    name_pengguna: null,
    name_petugas: null,
  },
  listLaporan: [
    {
      id_report: null,
      id_petugas: null,
      title: null,
      date_report: null,
      date_response: null,
      vis: null,
      stat: null,
      NIK: null,
    },
  ],
  listPetugas: [
    {
      id_petugas: null,
      name_petugas: null,
      telp: null,
      date_akun: null,
    },
  ],

  // Thunk
  penggunaRegistration: thunk(async (actions, payload) => {
    return instance
      .post("/pengguna/registrasi", payload)
      .then(async (response) => {
        await actions.registerAutoLogin(response);
        return Promise.resolve(response.data.notify);
      })
      .catch((err) => {
        return Promise.reject(err.response.data.notify || err);
      });
  }),
  masukApp: thunk(async (actions, payload) => {
    return instance
      .post("/auth/masuk", payload)
      .then(async (response) => {
        await actions.registerAutoLogin(response);
        return Promise.resolve(response.data.notify);
      })
      .catch((err) => {
        return Promise.reject(err.response.data.notify || err);
      });
  }),
  keluarApp: thunk(async (actions, payload) => {
    await actions.keluarAppState();
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
  registerAutoLogin: action((state, payload) => {
    const { NIK, accessToken, name_pengguna, role } = payload.data.responses;
    return {
      ...state,
      session: {
        ...state.session,
        isLogged: true,
        role,
        name: name_pengguna,
        NIK,
        token: accessToken,
      },
    };
  }),
  keluarAppState: action((state, payload) => {
    return {
      ...state,
      session: {
        isLogged: false,
        role: null,
        name: null,
        NIK: null,
        pic: null,
        telp: null,
        token: null,
      },
    };
  }),
};
