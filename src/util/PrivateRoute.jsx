import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useState as GlobalState } from "@hookstate/core";

import { LookupInstance, UIInstance } from "util/States";

export default function PrivateRoute({ comp: Component, ...rest }) {
  const state = GlobalState(LookupInstance);
  const stateUI = GlobalState(UIInstance);
  const {
    loading: { stats },
  } = stateUI.get();
  const { deggoLsi, elor } = state.get();

  let destiny = rest.path;

  const Checker = (role, destiny) => {
    if (role === "admin") {
      switch (destiny) {
        case "/laporanbaru":
        case "/tanggapanku":
        case "/semuatanggapan":
        case "/petugas":
        case "/pengaturan":
          return true;
        default:
          return false;
      }
    } else if (role === "petugas") {
      switch (destiny) {
        case "/laporanbaru":
        case "/tanggapanku":
        case "/pengaturan":
          return true;
        default:
          return false;
      }
    } else if (role === "pengguna") {
      switch (destiny) {
        case "/buatlaporan":
        case "/laporanku":
        case "/laporanpublik":
        case "/pengaturan":
          return true;
        default:
          return false;
      }
    }
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        return deggoLsi && Checker(elor, destiny) ? (
          !stats && <Component {...props} name={destiny.substring(1)} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
}
