import React, { useState } from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Label, TextArea, Notify, Button } from "style/Components";
import { DInstance, DataInstance } from "util/States";
import { FetchLaporanBaru } from "util/Fetches";
import { SchemaTanggapan } from "util/ValidationSchema";
import { TriggerPopup } from "util/Popup";
import { Exit } from "style/Icons";

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  .multiOption {
    display: flex;
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

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaTanggapan),
  });

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

  const switchRespon = () => {
    setManualTerima((prev) => !prev);
  };

  const handleResponse = (data, e) => {
    let action =
      e.nativeEvent.submitter === e.target[2] ? "Diterima" : "Ditolak";

    const next = () => {
      FetchLaporanBaru({
        action: "asResponse",
        ext: { ...data, submitter: action },
      });
    };

    TriggerPopup({
      content: `Respon laporan ${action}?`,
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
                  <Label htmlFor="resLaporan">
                    {errors.resLaporan?.message || "respon laporan"}
                  </Label>
                )}
                {manualTerima ? (
                  <OptionContainer
                    as="form"
                    onSubmit={handleSubmit(handleResponse)}
                  >
                    <TextArea
                      name="resLaporan"
                      id="resLaporan"
                      ref={register}
                    ></TextArea>
                    <div className="multiOption">
                      <Button
                        className="normalizeForButton"
                        onClick={switchRespon}
                        type="button"
                      >
                        <Exit className="inButton" />
                      </Button>
                      <Button>Diterima</Button>
                      <Button>Ditolak</Button>
                    </div>
                  </OptionContainer>
                ) : (
                  <OptionContainer>
                    <p>{"Pilih opsi respon"}</p>
                    <div className="multiOption">
                      <Button onClick={setToDiproses.bind(this, data.id)}>
                        Diproses
                      </Button>
                      <Button onClick={switchRespon}>Respon</Button>
                    </div>
                  </OptionContainer>
                )}
              </>
            );
          } else if (data?.status === "Diproses") {
            if (data?.petugas_uid === hashedUsrUID) {
              return (
                <>
                  <Label htmlFor="resLaporan">
                    {errors.resLaporan?.message || "respon laporan"}
                  </Label>
                  <OptionContainer
                    as="form"
                    onSubmit={handleSubmit(handleResponse)}
                  >
                    <TextArea
                      name="resLaporan"
                      id="resLaporan"
                      ref={register}
                    ></TextArea>
                    <div className="multiOption">
                      <Button>Ditolak</Button>
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
                <TextArea
                  name="resLaporan"
                  id="resLaporan"
                  defaultValue={data?.respon_detail}
                ></TextArea>
              </>
            );
          }
        } else {
          if (data?.respon_detail) {
            return (
              <>
                <Label htmlFor="resLaporan">respon laporan</Label>
                <TextArea
                  name="resLaporan"
                  id="resLaporan"
                  defaultValue={data?.respon_detail}
                ></TextArea>
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
