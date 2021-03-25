import React from "react";
import { Redirect, Route } from "react-router";
import { useStoreState } from "easy-peasy";

export default function PrivateRoute({ comp: Component, ...rest }) {
  const { isLogged, role } = useStoreState((state) => ({
    isLogged: state.session.isLogged,
    role: state.session.role,
  }));

  const Checker = (role, page) => {
    if (role === "admin") {
      switch (page) {
        case "LaporanBaru":
        case "Tanggapanku":
        case "Petugas":
          return true;
        default:
          return false;
      }
    } else if (role === "petugas") {
      switch (page) {
        case "LaporanBaru":
        case "Tanggapanku":
          return true;
        default:
          return false;
      }
    } else if (role === "pengguna") {
      switch (page) {
        case "BuatLaporan":
        case "Laporanku":
        case "LaporanPublik":
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
        return isLogged && Checker(role, Component.name) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
}
