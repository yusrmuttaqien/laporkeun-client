import React from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import { Label, TextArea, Notify, Button } from "style/Components";
import { DInstance, DataInstance } from "util/States";

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

  return (
    <>
      {(() => {
        if (role !== "pengguna") {
          if (data?.status === "Menunggu") {
            return (
              <OptionContainer>
                <p>{"Pilih opsi respon"}</p>
                <div className="multiOption">
                  <Button>Diproses</Button>
                  <Button>Diteima</Button>
                </div>
              </OptionContainer>
            );
          } else if (data?.status === "Diproses") {
            if (data?.petugas_uid === hashedUsrUID) {
              return <Notify message="Editor here" />;
            } else {
              return <Notify message="Dikerjakan oleh petugas lain" />;
            }
          } else {
            return (
              <>
                <Label htmlFor="resLaporan">respon laporan</Label>
                <TextArea name="resLaporan" id="resLaporan" disabled></TextArea>
              </>
            );
          }
        } else {
          if (data?.respon_detail) {
            return (
              <>
                <Label htmlFor="resLaporan">respon laporan</Label>
                <TextArea name="resLaporan" id="resLaporan" disabled></TextArea>
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
