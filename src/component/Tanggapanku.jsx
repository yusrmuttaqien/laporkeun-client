import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import rfs from "rfsjs";
import { useState as GlobalState } from "@hookstate/core";

import { useTanggapanku } from "util/CustomHooks";
import {
  ReportWrapper,
  Action,
  Report,
  ReportBody,
  Button,
} from "style/Components";
import { Instance } from "util/States";

const options = [
  { value: "Date DESC", label: "Terbaru" },
  { value: "Date ASC", label: "Terlama" },
  // { value: "stat Menunggu", label: "Menunggu" },
  // { value: "stat Diterima", label: "Diterima" },
];

const CustomReport = styled(Report)`
  .reportHeader {
    display: inherit;
    align-items: center;
    justify-content: space-between;

    h1 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const CustomSelect = styled(Select)`
  background-color: transparent;
  outline: none;
  width: 200px;

  .Select__control {
    background-color: transparent;
    border-color: ${(props) => props.theme.color.grey};
    box-shadow: none;

    .Select__value-container--has-value {
      .Select__single-value {
        color: ${(props) => props.theme.color.grey};
      }
    }

    &:hover {
      border-color: ${(props) => props.theme.color.purple};
    }
  }

  .Select__menu {
    background-color: ${(props) => props.theme.color.darkTransparent};
    backdrop-filter: blur(${(props) => props.theme.value.blur});
  }

  .Select__option {
    &.Select__option--is-selected {
      background-color: ${(props) => props.theme.color.purple};

      &.Select__option--is-focused {
        background-color: ${(props) => props.theme.color.purple};
      }
    }

    &.Select__option--is-focused {
      background-color: transparent;
    }
  }

  @media only screen and (max-width: 950px) {
    width: 140px;
  }
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

const ReportBodyCustom = styled(ReportBody)`
  position: relative;
  padding-right: 5px;
`;

const DataList = styled.div`
  /* background-color: ${(props) => props.theme.color.white}; */
  background-color: ${(props) => {
    if (props.stats === "Diterima") {
      return props.theme.color.done;
    } else if (props.stats === "Menunggu") {
      return props.theme.color.waiting;
    } else {
      return props.theme.color.white;
    }
  }};
  color: ${(props) => props.theme.color.dark};
  border-radius: ${(props) => props.theme.value.radius};

  display: inherit;
  justify-content: space-around;

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  ${Action} {
    width: 100px;
  }

  &:nth-child(1) {
    background-color: ${(props) => props.theme.color.purple};
    font-weight: ${(props) => props.theme.value.font.medium};
    color: ${(props) => props.theme.color.white};

    position: sticky;
    top: 0;

    cursor: default;

    ${Action} {
      cursor: default;
      width: 100px;
    }
  }

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

export default function Tanggapanku() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const state = GlobalState(Instance);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { hasMore, tanggapanku } = useTanggapanku(page, sort);

  const loadNext = () => {
    setPage(page + 1);
  };

  const handleChange = (value) => {
    setSort(value.value);
    setPage(1);
  };

  const handleDetails = (laporan) => {
    state.sideDetails.set(true);
    // fetch detail report
    // detailReport({ id: laporan.id_report, nik: laporan.NIK });
  };

  return (
    <ReportWrapper>
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={handleChange}
          />
        </div>
        {tanggapanku.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada tanggapan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section title="Tanggal respon">Tanggal respon</section>
              <section>ID petugas</section>
              <section>Status</section>
              <Action>Detail</Action>
            </DataList>
            {tanggapanku.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    handleDetails(laporan);
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && <MoreButton onClick={loadNext}>Muat lagi</MoreButton>}
          </ReportBodyCustom>
        )}
      </CustomReport>
    </ReportWrapper>
  );
}
