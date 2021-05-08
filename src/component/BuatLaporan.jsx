import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  ReportWrapper,
  Report,
  Button,
  ReportBody,
  Label,
  Input,
  CustomSelect,
  Action,
  TextArea,
  Warning,
} from "style/Components";
import { tipeLaporan, lokasi } from "util/Fetches";
import { Public, NoPublic } from "style/Icons";
import { SchemaLaporan } from "util/ValidationSchema";

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: 1px solid ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export default function BuatLaporan(props) {
  const [isPublic, setIsPublic] = useState(false);
  const [isPic, setIsPic] = useState();
  const [type, setType] = useState({});
  const [location, setLocation] = useState({});

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaLaporan),
  });

  const switchVis = () => {
    setIsPublic((prev) => !prev);
  };

  const switchSelect = (action) => {};

  const handlePic = (e) => {};

  const handleLaporan = (laporan) => {
    console.log(laporan);
  };

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            <Button>
              <Label className="forButton" htmlFor="picLaporan">
                Tambah gambar
              </Label>
              <Input
                type="file"
                name="picLaporan"
                id="picLaporan"
                accept="image/x-png,image/gif,image/jpeg"
                form="lapor"
                ref={register}
              />
            </Button>
            <Button type="submit" form="lapor">
              Laporkan
            </Button>
          </div>
        </div>
        <ReportBody
          className="forBuatLapor"
          as="form"
          id="lapor"
          onSubmit={handleSubmit(handleLaporan)}
        >
          <div>
            <section>
              <Label htmlFor="sLaporan">
                {errors.sLaporan?.message || "singkat laporan"}
              </Label>
              <Input type="text" name="sLaporan" id="sLaporan" ref={register} />
            </section>
            <section>
              <Label>{errors.sLaporan?.message || "tipe laporan"}</Label>
              <CustomSelect
                options={tipeLaporan}
                classNamePrefix={"Select"}
                defaultValue={tipeLaporan[0]}
                className="forBuatLapor"
                ref={register}
              />
            </section>
            <section>
              <Label>{errors.sLaporan?.message || "lokasi"}</Label>
              <CustomSelect
                options={lokasi}
                classNamePrefix={"Select"}
                defaultValue={lokasi[0]}
                className="forBuatLapor"
                ref={register}
              />
            </section>
            <section className="forBuatLaporVis">
              <Action onClick={switchVis}>
                {isPublic ? (
                  <>
                    <Public className="inAction" />
                    Publik
                  </>
                ) : (
                  <>
                    <NoPublic className="inAction" />
                    Privat
                  </>
                )}
              </Action>
            </section>
          </div>
          <div>
            <section>
              <Label htmlFor="dLaporan">
                {errors.dLaporan?.message || "detail laporan"}
              </Label>
              <TextArea name="dLaporan" id="dLaporan" ref={register}></TextArea>
            </section>
            <section>
              <Label>pratinjau gambar</Label>
              <Preview>Tambah gambar</Preview>
            </section>
          </div>
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}
