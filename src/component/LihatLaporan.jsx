import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { toast } from "react-hot-toast";

import {
  Report,
  ReportBody,
  ReportWrapper,
  Action,
  Button,
} from "./GlobalStyling";
import { useLaporanku } from "./FetchData";

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

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  section {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    text-align: center;

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

function Laporanku() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanku } = useLaporanku(page);

  const ToDetails = (id_report) => {
    console.log(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanku.length === 0 ? (
          <div>Tidak ada {pathname}</div>
        ) : (
          <ReportBodyCustom>
            {laporanku.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
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
            ))}
            {hasMore && <Button onClick={() => loadNext()}>Muat lagi</Button>}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function LaporanPublik() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const {
    laporanku,
    listPetugas,
    infinityScroll,
    infinityNumber,
  } = useStoreState((state) => ({
    laporanku: state.laporanku,
    listPetugas: state.listPetugas,
    infinityScroll: state.UI.infinityScroll,
    infinityNumber: state.UI.infinityNumber,
  }));
  const { populateReportSelf, setCountQue } = useStoreActions((actions) => ({
    populateReportSelf: actions.populateReportSelf,
    setCountQue: actions.setCountQue,
  }));

  const ToDetails = (id_report) => {
    console.log(id_report);
  };

  const loadNext = async () => {
    await setCountQue(infinityNumber + 1);
  };

  useEffect(() => {
    toast.promise(populateReportSelf({ page: infinityNumber, limit: 20 }), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => msg,
      error: (err) => err && err.toString(),
    });
  }, [infinityNumber, populateReportSelf]);

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanku.length === 0 || listPetugas.length === null ? (
          <div>Tidak ada {pathname}</div>
        ) : (
          <ReportBodyCustom>
            {pathname === "laporanku" ||
            pathname === "laporanpublik" ||
            pathname === "laporanbaru"
              ? laporanku.map((laporan, index) => (
                  <DataList key={index}>
                    <section title={laporan.title}>{laporan.title}</section>
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
              laporanku.map((laporan, index) => (
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
        )}
        {infinityScroll && (
          <Button onClick={() => loadNext()}>Muat lagi</Button>
        )}
      </Report>
    </ReportWrapper>
  );
}

export { Laporanku, LaporanPublik };
