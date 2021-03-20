import React from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { Report, ReportBody, ReportWrapper, Action } from "./GlobalStyling";

const DummyDatas = [
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
  {
    judul: "judul laporan",
    tgl: "03/10/2021",
    vis: "Public",
    stat: "Diterima",
  },
];

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

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname.substring(1)}</h1>
        <ReportBodyCustom>
          {DummyDatas.map((value, index) => {
            return (
              <DataList key={index}>
                <section>{value.judul}</section>
                <section>{value.tgl}</section>
                <section>{value.vis}</section>
                <section>{value.stat}</section>
                <Action title="Buka Detail">
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            );
          })}
        </ReportBodyCustom>
      </Report>
    </ReportWrapper>
  );
}
