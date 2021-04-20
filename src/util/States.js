import { createState } from "@hookstate/core";

const State = {
  sideDetailsPayload: { id: null, nik: null, petugas: null },
  session: {
    isLogged: false,
    role: null,
    name: null,
    NIK: null,
    pic: null,
    telp: null,
    token: null,
    id_petugas: null,
  },
  sideDetails: false,
  newResponseByIDReport: null,
  forms: "Masuk",
};

export const Instance = createState(State);
