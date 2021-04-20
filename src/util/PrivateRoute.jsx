import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useState as GlobalState } from "@hookstate/core";

import { Instance } from "util/States";

export default function PrivateRoute({ comp: Component, ...rest }) {
  const state = GlobalState(Instance);
  const { isLogged, role } = state.session.get();

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
        return isLogged && Checker(role, destiny) ? (
          <Component {...props} sd={rest.sd} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
}
