import React, { useState, useEffect } from "react";
import { useState as GlobalState } from "@hookstate/core";

import {
  ReportWrapper,
  Action,
  Report,
  ReportBody,
  Button,
  CustomSelect,
  DataList,
  Notify,
} from "style/Components";
import { FetchesInstance } from "util/States";
import { Reload, Lock, UnLock } from "style/Icons";
import { sortSelect, FetchPetugas } from "util/Fetches";
import { TriggerPopup } from "util/Popup";
import PetugasRegistrasi from "component/PetugasRegistrasi";

export default function Petugas(props) {
  const state = GlobalState(FetchesInstance);
  const { isLoading } = state.get();
  const { payload, lastFetch, orderBy } = state.petugas.get();
  const [isRegis, setIsRegis] = useState(false);

  const optionChange = (option) => {
    FetchPetugas({ action: "sortFetch", ext: option });
  };

  const isRegisterSwitch = () => {
    setIsRegis((prev) => !prev);
  };

  const fetchMore = () => {
    FetchPetugas({ action: "moreFetch" });
  };

  const resetFetch = () => {
    FetchPetugas({ action: "resetFetch" });
  };

  const closeFetch = (data) => {
    const dataObj = {
      name: data[0],
      identify: data[1],
      suspended: data[2],
    };

    TriggerPopup({
      content: dataObj.suspended
        ? `Buka petugas ${dataObj.name}?`
        : `Tutup petugas ${dataObj.name}?`,
      cbYes: FetchPetugas,
      param: { action: "closeFetch", ext: dataObj },
    });
  };

  useEffect(() => {
    FetchPetugas({ action: "effectFetch" });
  }, []);

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            {!isRegis && (
              <>
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
                <Button
                  disabled={lastFetch === 0 || isLoading}
                  onClick={fetchMore}
                >
                  {lastFetch === 0 ? "Akhir data" : "Muat lagi"}
                </Button>
              </>
            )}
            <Button onClick={isRegisterSwitch}>
              {isRegis ? "Kembali" : "Tambah petugas"}
            </Button>
          </div>
        </div>
        {isRegis ? (
          <PetugasRegistrasi />
        ) : payload ? (
          <ReportBody className="forPetugas">
            <DataList className="forHeading">
              <section>Nama</section>
              <section>Tanggal akun</section>
              <section>Telp</section>
              <Action>Aksi</Action>
            </DataList>
            {Object.entries(payload).map((data, index) => (
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
            ))}
          </ReportBody>
        ) : (
          <Notify message={isLoading ? "Memuat" : "Tidak ada petugas"} />
        )}
      </Report>
    </ReportWrapper>
  );
}
