import React, { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { useStoreActions } from "easy-peasy";
import { Link } from "react-router-dom";

import {
  Report,
  ReportBody,
  ReportWrapper,
  Action,
  Button,
} from "./GlobalStyling";
import {
  useLaporanku,
  useLaporanPublik,
  useLaporanBaru,
  useTanggapanku,
} from "./FetchData";
// import NoLaporan from "./../asset/noLaporan.svg";
import rfs from "./RFS";

const ReportBodyCustom = styled(ReportBody)`
  position: relative;
  padding-right: 5px;
`;

const ReportBodyCustomNotFound = styled(ReportBody)`
  justify-content: center;
  align-items: center;

  img {
    ${rfs("70%", "width")};
  }

  a {
    color: ${(props) => props.theme.color.white};
  }
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

const MoreButton = styled(Button)`
  margin-bottom: 0.5em;
`;

function Laporanku() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { loading, hasMore, laporanku } = useLaporanku(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanku.length === 0 || loading ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>
            Tidak ada laporan
            <Link to="/buatlaporan">Buat laporan disini</Link>
          </ReportBodyCustomNotFound>
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
                  onClick={() =>
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK })
                  }
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function LaporanPublik() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { loading, hasMore, laporanpublik } = useLaporanPublik(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanpublik.length === 0 || loading ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>
            Tidak ada laporan
            <Link to="/buatlaporan">Buat laporan disini</Link>
          </ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            {laporanpublik.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() =>
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK })
                  }
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function LaporanBaru() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanbaru } = useLaporanBaru(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanbaru.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() =>
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK })
                  }
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function Tanggapanku() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanbaru } = useTanggapanku(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanbaru.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() =>
                    ToDetails({
                      id: laporan.id_report,
                      petugas: laporan.id_petugas,
                    })
                  }
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

export { Laporanku, LaporanPublik, LaporanBaru, Tanggapanku };
