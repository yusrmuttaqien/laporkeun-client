import React, { useEffect } from "react";
import { useState as GlobalState } from "@hookstate/core";

import {
  ReportWrapper,
  Report,
  ReportBody,
  Button,
  CustomSelect,
  DataList,
  Notify,
  Action,
} from "style/Components";
import { FetchesInstance } from "util/States";
import { Reload, Info } from "style/Icons";
import { sortSelect, FetchLaporanku } from "util/Fetches";

export default function Laporanku(props) {
  const state = GlobalState(FetchesInstance);
  const { isLoading } = state.get();
  const { payload, lastFetch, orderBy } = state.laporanku.get();

  const optionChange = (option) => {
    FetchLaporanku({ action: "sortFetch", ext: option });
  };

  const fetchMore = () => {
    FetchLaporanku({ action: "moreFetch" });
  };

  const resetFetch = () => {
    FetchLaporanku({ action: "resetFetch" });
  };

  useEffect(() => {
    FetchLaporanku({ action: "effectFetch" });
  }, []);

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            <CustomSelect
              options={sortSelect}
              classNamePrefix={"Select"}
              defaultValue={sortSelect[orderBy]}
              value={sortSelect[orderBy]}
              onChange={optionChange}
              isDisabled={payload ? false : true}
            />
            <Button
              onClick={resetFetch}
              className="forIcon"
              title="Muat ulang"
              disabled={isLoading}
            >
              <Reload className="inButton" />
            </Button>
            <Button disabled={lastFetch === 0 || isLoading} onClick={fetchMore}>
              {lastFetch === 0 ? "Akhir data" : "Muat lagi"}
            </Button>
          </div>
        </div>
        {payload ? (
          <ReportBody className="forDataList">
            <DataList className="forHeading">
              <section>Judul</section>
              <section>Tanggal lapor</section>
              <section>Lokasi</section>
              <section>Tipe</section>
              <Action>Aksi</Action>
            </DataList>
            {Object.entries(payload).map((data, index) => (
              <DataList
                className="forBody forData"
                key={index}
                stats={data[1].status}
              >
                <section title={data[1].title}>{data[1].title}</section>
                <section>{data[1].lapor_date?.split("T")[0]}</section>
                <section>{data[1].location.prov}</section>
                <section>{data[1].type}</section>
                <Action title="Detail laporan">
                  <Info />
                </Action>
              </DataList>
            ))}
          </ReportBody>
        ) : (
          <Notify message="Tidak ada laporan" />
        )}
      </Report>
    </ReportWrapper>
  );
}
