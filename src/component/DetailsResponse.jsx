import React, { useState, useEffect } from "react";
import { useState as GlobalState } from "@hookstate/core";

import { Label, TextArea, Notify } from "style/Components";
import { DInstance, DataInstance } from "util/States";

export default function DetailsResponse() {
  const [mode, setMode] = useState("checking");

  const stateD = GlobalState(DInstance);
  const stateData = GlobalState(DataInstance);
  const { data, loading } = stateD.get();
  const { role } = stateData.session.get();

  useEffect(() => {
    // Checking
    switch (role) {
      case "pengguna":
        data?.respon_detail ? setMode("penggunaRes") : setMode("penggunaNoRes");
        break;
      case "admin":
      case "petugas":
        if (data?.status === "Menunggu") {
          setMode("petugasRes");
        } else if (data?.status === "Diproses") {
        }
        break;
      default:
        break;
    }
  }, [data?.respon_detail, data?.status, role]);

  const ComponentSwitch = Object.freeze({
    checking: <Notify message="Mengecek respon" />,
    penggunaRes: (
      <>
        <Label htmlFor="resLaporan">respon laporan</Label>
        <TextArea name="resLaporan" id="resLaporan" disabled></TextArea>
      </>
    ),
    penggunaNoRes: <Notify message="Belum ada respon" />,
    petugasRes: (
      <>
        <Label htmlFor="resLaporan">respon laporan</Label>
        <TextArea name="resLaporan" id="resLaporan"></TextArea>
      </>
    ),
  });

  return ComponentSwitch[mode];
}
