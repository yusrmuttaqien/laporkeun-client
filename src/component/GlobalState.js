import { action, thunk, persist } from "easy-peasy";

import { instance } from "./FetchData";
import { storage } from "./util/Firebase";

export const state = {
  sideDetailsPayload: { id: null, nik: null, petugas: null },
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
  newResponseByIDReport: null,

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
    var theName, type;
    console.log(payload);
    if (payload.pic[0]) {
      type = payload.pic[0].name.split(".");
      theName = `${getState().session.NIK}_${Date.now()}.${type}`;
    }
    try {
      if (payload.pic[0]) {
        // Firebase Storage
        type = type[type.length - 1];
        const file = payload.pic[0];
        const storageRef = storage.ref("/image");
        const fileRef = storageRef.child(theName);
        await fileRef.put(file);
        payload.pic = theName;
      }

      if (!payload.pic[0]) {
        payload.pic = null;
      }

      // DB
      const response = await instance.post("/laporan/buat", payload, {
        headers: { authorization: `Bearer ${getState().session.token}` },
      });
      return await Promise.resolve(response.data.notify);
    } catch (err) {
      return await Promise.reject(err.response.data.notify || err);
    }
  }),
  detailReport: thunk((actions, payload) => {
    actions.setSideActiveDetails(payload);
  }),
  newResponse: thunk(async (actions, payload, { getState }) => {
    try {
      const datas = {
        id_petugas: getState().session.id_petugas,
        id_report: getState().newResponseByIDReport,
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
      sideDetailsFocus: !state.sideDetailsFocus,
    };
  }),
  setSideActiveDetails: action((state, payload) => {
    return {
      ...state,
      sideDetailsPayload: {
        id: payload.id,
        nik: payload.nik ? payload.nik : null,
        petugas: payload.petugas ? payload.petugas : null,
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
  setResponseByIDReport: action((state, payload) => {
    return {
      ...state,
      newResponseByIDReport: payload,
    };
  }),
};
