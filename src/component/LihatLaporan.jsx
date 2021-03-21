import React from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { Report, ReportBody, ReportWrapper, Action } from "./GlobalStyling";
import { useStoreState } from "easy-peasy";

const ReportBodyCustom = styled(ReportBody)`
  position: relative;
  padding-right: 5px;
`;

const DataList = styled.div`
  background-color: ${(props) => props.theme.color.white};
  color: ${(props) => props.theme.color.dark};
  border-radius: ${(props) => props.theme.value.radius};

  display: inherit;
  justify-content: space-around;

  padding: 0.3em 0;
  margin-bottom: 0.5em;

  section {
    &:nth-child(1) {
      font-weight: ${(props) => props.theme.value.font.medium};
    }
  }

  @media only screen and (max-width: 950px) {
    section {
      &:nth-child(2) {
        display: none;
      }
    }
  }
`;

export default function LihatLaporan() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const { listLaporan, listPetugas } = useStoreState((state) => ({
    listLaporan: state.listLaporan,
    listPetugas: state.listPetugas,
  }));

  const ToDetails = (id_report) => {
    console.log(id_report);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        <ReportBodyCustom>
          {pathname === "laporanku" ||
          pathname === "laporanpublik" ||
          pathname === "laporanbaru"
            ? listLaporan.map((laporan, index) => (
                <DataList key={index}>
                  <section>{laporan.title}</section>
                  <section>{laporan.date_report}</section>
                  <section>{laporan.vis}</section>
                  <section>{laporan.stat}</section>
                  <Action
                    title="Buka Detail"
                    onClick={() => ToDetails(laporan.id_report)}
                  >
                    <span className="material-icons">launch</span>
                  </Action>
                </DataList>
              ))
            : null}
          {pathname === "tanggapanku" &&
            listLaporan.map((laporan, index) => (
              <DataList key={index}>
                <section>{laporan.title}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_report}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => ToDetails(laporan.id_report)}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
          {pathname === "petugas" &&
            listPetugas.map((petugas, index) => (
              <DataList key={index}>
                <section>{petugas.name_petugas}</section>
                <section>{petugas.id_petugas}</section>
                <section>{petugas.date_akun}</section>
                <section>{petugas.telp}</section>
              </DataList>
            ))}
        </ReportBodyCustom>
      </Report>
    </ReportWrapper>
  );
}
