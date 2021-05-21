import React from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import { Button } from "style/Components";
import { Exit } from "style/Icons";
import { DInstance } from "util/States";
import { uidAccDateChecker } from "util/Helper";
import { TriggerPopup } from "util/Popup";
import { FetchLaporanku } from "util/Fetches";

const Control = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .multiOption {
    display: inherit;
    align-items: center;

    button:not(:first-child) {
      margin-left: 0.5em;
    }
  }
`;

const Title = styled.h1`
  align-self: flex-end;

  font-size: 1.1rem;
  font-weight: ${(props) => props.theme.value.font.normal};
`;

export default function DetailsControl(props) {
  const state = GlobalState(DInstance);
  const { data, loading } = state.get();

  const handleDelete = () => {
    const next = () => {
      FetchLaporanku({ action: "deleteFetch", ext: data?.id });
    };

    TriggerPopup({
      content: "Hapus laporan?",
      txtYes: "Ya",
      txtNo: "Tidak",
      cbYes: next,
    });
  };

  const handleBlur = () => {
    state.stats.set(false);
  };

  return (
    <Control>
      <Button className="normalizeForButton" onClick={handleBlur}>
        <Exit className="inButton" />
      </Button>
      {!loading && (
        <>
          <Title>{data?.title}</Title>
          <div className="multiOption">
            {data?.status === "Diterima" && <Button>unduh</Button>}
            {data?.status === "Menunggu" &&
            uidAccDateChecker(data?.lapor_date, data?.pengguna_uid) ? (
              <Button onClick={handleDelete}>hapus</Button>
            ) : null}
          </div>
        </>
      )}
    </Control>
  );
}
