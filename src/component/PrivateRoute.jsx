import React from "react";
import { Redirect, Route } from "react-router";
import { useStoreState } from "easy-peasy";

export default function PrivateRoute({ comp: Component, ...rest }) {
  const { isLogged, role } = useStoreState((state) => ({
    isLogged: state.session.isLogged,
    role: state.session.role,
  }));

  let destiny = rest.path;

  const Checker = (role, destiny) => {
    if (role === "admin") {
      switch (destiny) {
        case "/laporanbaru":
        case "/tanggapanku":
        case "/semuatanggapan":
        case "/petugas":
          return true;
        default:
          return false;
      }
    } else if (role === "petugas") {
      switch (destiny) {
        case "/laporanbaru":
        case "/tanggapanku":
          return true;
        default:
          return false;
      }
    } else if (role === "pengguna") {
      switch (destiny) {
        case "/buatlaporan":
        case "/laporanku":
        case "/laporanpublik":
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
