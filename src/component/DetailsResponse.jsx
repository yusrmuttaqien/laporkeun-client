import React from "react";
import { useState as GlobalState } from "@hookstate/core";

import { Label, TextArea, Notify } from "style/Components";
import { DInstance, DataInstance } from "util/States";

export default function DetailsResponse() {
  const stateD = GlobalState(DInstance);
  const stateData = GlobalState(DataInstance);
  const { data, loading } = stateD.get();
  const { role } = stateData.session.get();

  const Component = Object.freeze({
    pengguna: (
      <>
        <Label htmlFor="resLaporan">respon laporan</Label>
        <TextArea name="resLaporan" id="resLaporan" disabled></TextArea>
      </>
    ),
  });

  return Component["pengguna"];
}
