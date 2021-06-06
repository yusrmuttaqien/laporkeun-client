import React, { useState } from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import { Label, TextArea, Notify, Button } from "style/Components";
import { DInstance, DataInstance } from "util/States";
import { FetchLaporanBaru } from "util/Fetches";
import { TriggerPopup } from "util/Popup";

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  .multiOption {
    margin-top: 1em;

    button:not(:first-child) {
      margin-left: 0.5em;
    }
  }
`;

export default function DetailsResponse() {
  const stateD = GlobalState(DInstance);
  const stateData = GlobalState(DataInstance);
  const { data } = stateD.get();
  const { role, hashedUsrUID } = stateData.session.get();
  const [manualTerima, setManualTerima] = useState(false);

  const setToDiproses = (id) => {
    const next = () => {
      FetchLaporanBaru({ action: "asDiproses", ext: id });
    };

    TriggerPopup({
      content: "Ubah status 'diproses'?",
      txtYes: "Ya",
      txtNo: "Tidak",
      cbYes: next,
    });
  };

  return (
    <>
      {(() => {
        if (role !== "pengguna") {
          if (data?.status === "Menunggu") {
            return (
              <>
                {manualTerima && (
                  <Label htmlFor="resLaporan">respon laporan</Label>
                )}
                <OptionContainer>
                  {manualTerima ? (
                    <TextArea name="resLaporan" id="resLaporan"></TextArea>
                  ) : (
                    <p>{"Pilih opsi respon"}</p>
                  )}
                  <div className="multiOption">
                    <Button onClick={setToDiproses.bind(this, data.id)}>
                      Diproses
                    </Button>
                    <Button>Diterima</Button>
                  </div>
                </OptionContainer>
              </>
            );
          } else if (data?.status === "Diproses") {
            if (data?.petugas_uid === hashedUsrUID) {
              return (
                <>
                  <Label htmlFor="resLaporan">respon laporan</Label>
                  <OptionContainer>
                    <TextArea name="resLaporan" id="resLaporan"></TextArea>
                    <div className="multiOption">
                      <Button onClick={setToDiproses.bind(this, data.id)}>
                        Ditolak
                      </Button>
                      <Button>Diterima</Button>
                    </div>
                  </OptionContainer>
                </>
              );
            } else {
              return (
                <Notify
                  message={`Dikerjakan oleh petugas ${data?.petugas_name}`}
                />
              );
            }
          } else {
            return (
              <>
                <Label htmlFor="resLaporan">respon laporan</Label>
                <TextArea name="resLaporan" id="resLaporan" disabled>
                  {data?.respon_detail}
                </TextArea>
              </>
            );
          }
        } else {
          if (data?.respon_detail) {
            return (
              <>
                <Label htmlFor="resLaporan">respon laporan</Label>
                <TextArea name="resLaporan" id="resLaporan" disabled>
                  {data?.respon_detail}
                </TextArea>
              </>
            );
          } else {
            return <Notify message="Belum ada respon" />;
          }
        }
      })()}
    </>
  );
}
