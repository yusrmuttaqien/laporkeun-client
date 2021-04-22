import { createState } from "@hookstate/core";

const SessionTemplate = {
  isLogged: false,
  role: null,
  name: null,
  NIK: null,
  pic: null,
  picURL: null,
  telp: null,
}

const State = {
  sideDetailsPayload: { id: null, nik: null, petugas: null },
  session: {
    isLogged: false,
    role: null,
    name: null,
    NIK: null,
    pic: null,
    picURL: null,
    telp: null,
  },
  sideDetails: false,
  newResponseByIDReport: null,
  forms: "Masuk",
};

const Instance = createState(State);

export { Instance, SessionTemplate };
