import React, { useState } from "react";
import styled from "styled-components";
import {
  Label,
  Input,
  TextArea,
  ReportWrapper,
  Report,
  ReportBody,
  Action,
  Button,
} from "./GlobalStyling";

const ReportHeader = styled.div`
  display: flex;
  align-items: flex-end;

  section {
    display: inherit;
    flex-direction: column;
    flex: 1;
  }
`;

const ActionCustom = styled(Action)`
  padding: 0.7em 0em;
  width: 5em;
`;

const ReportBodyCustom = styled(ReportBody)`
  section {
    display: inherit;
    justify-content: flex-end;

    padding: 1em 0;
  }
`;

const CustomButton = styled(Button)`
  margin: 0em 0 0.5em;

  &:nth-last-child(1) {
    margin-left: 1em;
  }
`;

function BuatLaporan() {
  const [action, setAction] = useState(false);

  const changeAction = () => {
    setAction(!action);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>buat laporanmu</h1>
        <ReportHeader>
          <section>
            <Label htmlFor="judulLaporan">judul laporan</Label>
            <Input type="text" name="judulLaporan" id="judulLaporan" />
          </section>
          <ActionCustom title="Ubah visibilitas" onClick={() => changeAction()}>
            <span className="material-icons">
              {action ? "public" : "public_off"}
            </span>
            {action ? "Publik" : "Privat"}
          </ActionCustom>
        </ReportHeader>
        <ReportBodyCustom>
          <Label htmlFor="isiLaporan">isi laporan</Label>
          <TextArea></TextArea>
          <section>
            <CustomButton>Tambah gambar</CustomButton>
            <CustomButton>Lapor!</CustomButton>
          </section>
        </ReportBodyCustom>
      </Report>
    </ReportWrapper>
  );
}

export default BuatLaporan;
