import { action, thunk, persist } from "easy-peasy";
import toast from "react-hot-toast";

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
    id_petugas: null,
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
  petugasRegistration: thunk(async (actions, payload, { getState }) => {
    try {
      const response = await instance.post("/petugas/registrasi", payload, {
        headers: { authorization: `Bearer ${getState().session.token}` },
      });
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
  detailReport: thunk(async (actions, payload, { getState }) => {
    if (payload.nik) {
      try {
        const response = await instance.get("/laporan/detail", {
          headers: { authorization: `Bearer ${getState().session.token}` },
          params: { id: payload.id, nik: payload.nik },
        });
        await actions.setActiveDetails(response.data.output);
        actions.toggleFocusDetails();
        return 0;
      } catch (err) {
        toast.error(err.response.data.notify);
        return 1;
      }
    } else {
      try {
        const response = await instance.get("/laporan/detailPetugas", {
          headers: { authorization: `Bearer ${getState().session.token}` },
          params: { id: payload.id, petugas: payload.petugas },
        });
        await actions.setActiveDetails(response.data.output);
        actions.toggleFocusDetails();
        return 0;
      } catch (err) {
        toast.error(err.response.data.notify);
        return 1;
      }
    }
  }),
  newResponse: thunk(async (actions, payload, { getState }) => {
    try {
      const datas = {
        id_petugas: getState().session.id_petugas,
        id_report: getState().activeDetail.id_report,
        response: payload.responBalik,
      };
      const response = await instance.post("/laporan/respon", datas, {
        headers: { authorization: `Bearer ${getState().session.token}` },
      });
      actions.toggleFocusDetails();
      return await Promise.resolve(response.data.notify);
    } catch (err) {
      return await Promise.reject(err.response.data.notify || err);
    }
  }),
  deletePetugas: thunk(async (actions, payload, { getState }) => {
    try {
      const response = await instance.post(
        "/petugas/delete",
        { id: payload },
        {
          headers: { authorization: `Bearer ${getState().session.token}` },
        }
      );
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
    const {
      NIK,
      accessToken,
      name_pengguna,
      role,
      name_petugas,
      id_petugas,
    } = payload.data.responses;
    return {
      ...state,
      session: {
        ...state.session,
        isLogged: true,
        role,
        name: name_pengguna || name_petugas,
        NIK:
          role === "admin"
            ? "Administrator"
            : role === "petugas"
            ? "Petugas"
            : NIK,
        token: accessToken,
        id_petugas: id_petugas && id_petugas,
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
  setActiveDetails: action((state, payload) => {
    return {
      ...state,
      activeDetail: {
        ...payload,
      },
    };
  }),
};
