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
  Label,
} from "style/Components";
import { FetchesInstance } from "util/States";
import { Reload, Info } from "style/Icons";
import { sortSelect, FetchTanggapanku } from "util/Fetches";
import { TriggerDetails } from "component/Details";

export default function Tanggapanku(props) {
  const state = GlobalState(FetchesInstance);
  const { isLoading } = state.get();
  const { payload, lastFetch, orderBy } = state.tanggapanku.get();

  const optionChange = (option) => {
    FetchTanggapanku({ action: "sortFetch", ext: option });
  };

  const fetchMore = () => {
    FetchTanggapanku({ action: "moreFetch" });
  };

  const resetFetch = () => {
    FetchTanggapanku({ action: "resetFetch" });
  };

  const showDetails = (e) => {
    TriggerDetails({ id: e.id, status: e.status, action: "Tanggapanku" });
  };

  useEffect(() => {
    FetchTanggapanku({ action: "effectFetch" });
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
            <Label>Diterima</Label>
            {Object.entries(payload).map(
              (data, index) =>
                data[1].status === "Diterima" && (
                  <DataList
                    className="forBody forData"
                    key={index}
                    stats={data[1].status}
                  >
                    <section title={data[1].title}>{data[1].title}</section>
                    <section>{data[1].lapor_date}</section>
                    <section>{data[1].location.prov}</section>
                    <section>{data[1].type}</section>
                    <Action
                      title="Detail laporan"
                      onClick={showDetails.bind(this, {
                        id: data[1].id,
                        status: data[1].status,
                      })}
                    >
                      <Info />
                    </Action>
                  </DataList>
                )
            )}
            <Label>Ditolak</Label>
            {Object.entries(payload).map(
              (data, index) =>
                data[1].status === "Ditolak" && (
                  <DataList
                    className="forBody forData"
                    key={index}
                    stats={data[1].status}
                  >
                    <section title={data[1].title}>{data[1].title}</section>
                    <section>{data[1].lapor_date}</section>
                    <section>{data[1].location.prov}</section>
                    <section>{data[1].type}</section>
                    <Action
                      title="Detail laporan"
                      onClick={showDetails.bind(this, {
                        id: data[1].id,
                        status: data[1].status,
                      })}
                    >
                      <Info />
                    </Action>
                  </DataList>
                )
            )}
          </ReportBody>
        ) : (
          <Notify message="Tidak ada laporan" />
        )}
      </Report>
    </ReportWrapper>
  );
}
