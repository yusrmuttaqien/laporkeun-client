import { action, thunk, persist } from "easy-peasy";

import { instance } from "./FetchData";

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
  listPetugas: [],

  // Thunk
  penggunaRegistration: thunk(async (actions, payload) => {
    try {
      const response = await instance.post("/pengguna/registrasi", payload);
      await actions.registerAutoLogin(response);
      return await Promise.resolve(response.data.notify);
    } catch (err) {
      return await Promise.reject(err.response.data.notify || err);
    }
  }),
  masukApp: thunk(async (actions, payload) => {
    try {
      const response = await instance.post("/auth/masuk", payload);
      await actions.registerAutoLogin(response);
      return await Promise.resolve(response.data.notify);
    } catch (err) {
      return await Promise.reject(err.response.data.notify || err);
    }
  }),
  keluarApp: thunk(async (actions, payload) => {
    await actions.keluarAppState();
  }),
  newReport: thunk(async (actions, payload, { getState }) => {
    try {
      const response = await instance.post("/laporan/buat", payload, {
        headers: { authorization: `Bearer ${getState().session.token}` },
      });
      return await Promise.resolve(response.data.notify);
    } catch (err) {
      return await Promise.reject(err.response.data.notify || err);
    }
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
