import React, { useEffect } from "react";
import { useState as GlobalState } from "@hookstate/core";
import { useHistory } from "react-router-dom";

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
import { Reload } from "style/Icons";
import { sortSelect } from "util/Fetches";

export default function Laporanku(props) {
  const state = GlobalState(FetchesInstance);
  const { isLoading } = state.get();
  const { payload, lastFetch, orderBy } = state.petugas.get();

  const history = useHistory();

  const optionChange = (option) => {};

  const fetchMore = () => {};

  const resetFetch = () => {};

  useEffect(() => {}, []);

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
        <ReportBody className="forDataList">
          <DataList className="forHeading">
            <section>Judul</section>
            <section>Tanggal lapor</section>
            <section>Lokasi</section>
            <section>Tipe</section>
            <Action>Aksi</Action>
          </DataList>
          {/* {Object.entries(payload).map((data, index) => (
            <DataList
              className="forBody forData"
              key={index}
              suspended={data[1].suspended}
            >
              <section>{data[1].name}</section>
              <section>{data[1].acc_date.split("T")[0]}</section>
              <section>{data[1].telp || "Tidak tersedia"}</section>
              <Action
                title={data[1].suspended ? "Buka petugas" : "Tutup petugas"}
                onClick={() =>
                  closeFetch([data[1].name, data[1].nik, data[1].suspended])
                }
              >
                {data[1].suspended ? <UnLock /> : <Lock />}
              </Action>
            </DataList>
          ))} */}
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}
