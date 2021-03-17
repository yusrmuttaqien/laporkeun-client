import React, { useState } from "react";
import styled from "styled-components";
import { Label, Input, TextArea } from "./GlobalStyling";

const ReportWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  height: inherit;
  min-height: inherit;
`;

const Report = styled.div`
  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  border-radius: ${(props) => props.theme.value.radius}
    ${(props) => props.theme.value.radius} 0 0;
  color: ${(props) => props.theme.color.white};

  height: 95%;
  width: 88%;
  padding: 35px 50px 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
    font-weight: ${(props) => props.theme.value.font.medium};
    font-size: 3rem;
  }
`;

const ReportHeader = styled.div`
  display: flex;
  align-items: flex-end;

  section {
    display: inherit;
    flex-direction: column;
    flex: 1;
  }
`;

const Visibility = styled.div`
  cursor: pointer;
  user-select: none;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.7em 0em;
  width: 5em;
`;

const ReportBody = styled.div`
  flex: 1;
  display: inherit;
  flex-direction: column;

  section {
    display: inherit;

    justify-content: flex-end;
  }
`;

const CustomButton = styled.button`
  font-weight: ${(props) => props.theme.value.font.medium};
  font-size: 1rem;
  border-radius: ${(props) => props.theme.value.radius};
  outline: none;
  border: none;
  transition: ${(props) => props.theme.value.transition};
  transition-property: background-color, color;
  letter-spacing: 0.125em;

  padding: 0.3em 0.8em;
  margin: 0em 0 0.5em;

  &:nth-last-child(1) {
    margin-left: 1em;
  }

  &:hover {
    color: ${(props) => props.theme.color.white};
    background-color: ${(props) => props.theme.color.dark};
    cursor: pointer;
  }
`;

function BuatLaporan() {
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    setVisibility(!visibility);
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
          <Visibility
            title="Ubah visibilitas"
            onClick={() => changeVisibility()}
          >
            <span className="material-icons">
              {visibility ? "public" : "public_off"}
            </span>
            {visibility ? "Publik" : "Privat"}
          </Visibility>
        </ReportHeader>
        <ReportBody>
          <Label htmlFor="isiLaporan">isi laporan</Label>
          <TextArea></TextArea>
          <section>
            <CustomButton>Tambah gambar</CustomButton>
            <CustomButton>Lapor!</CustomButton>
          </section>
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}

export default BuatLaporan;
