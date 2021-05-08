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
} from "style/Components";
import { tipeLaporan, lokasi } from "util/Fetches";
import { Public, NoPublic } from "style/Icons";
import { SchemaLaporan } from "util/ValidationSchema";

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  height: 100%;

  border: 1px solid ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  img {
    width: 95%;
    margin-bottom: 1em;
  }

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export default function BuatLaporan(props) {
  const [isPublic, setIsPublic] = useState(false);
  const [isPic, setIsPic] = useState();
  const [type, setType] = useState({ id: 0 });
  const [location, setLocation] = useState({
    id: 0,
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaLaporan),
  });

  const switchVis = () => {
    setIsPublic((prev) => !prev);
  };

  const switchSelect = (action, e) => {
    switch (action) {
      case "type":
        setType({ id: e.id });
        break;
      case "location":
        setLocation({ id: e.id });
        break;
      default:
        break;
    }
  };

  const checkSelect = () => {
    if (type.id === 0 && location.id === 0) {
      setType({ message: "tipe wajib diisi" });
      setLocation({ message: "lokasi wajib diisi" });
      return 0;
    }

    if (type.id === 0) {
      setType({ message: "tipe wajib diisi" });
      return 0;
    }

    if (location.id === 0) {
      setLocation({ message: "lokasi wajib diisi" });
      return 0;
    }

    return 1;
  };

  const handlePic = (e) => {
    setIsPic({
      file: URL.createObjectURL(e.target.files[0]),
      name: e.target.files[0].name,
    });
  };

  const handleLaporan = (laporan) => {
    if (!checkSelect()) return 0;

    console.log({ ...laporan, type, location });
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
                onChange={handlePic}
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
          onSubmit={handleSubmit(handleLaporan, checkSelect)}
        >
          <div>
            <section>
              <Label htmlFor="sLaporan">
                {errors.sLaporan?.message || "singkat laporan"}
              </Label>
              <Input type="text" name="sLaporan" id="sLaporan" ref={register} />
            </section>
            <section>
              <Label>{type.message || "tipe laporan"}</Label>
              <CustomSelect
                options={tipeLaporan}
                classNamePrefix={"Select"}
                defaultValue={tipeLaporan[0]}
                className="forBuatLapor"
                value={tipeLaporan[type]}
                onChange={(e) => switchSelect("type", e)}
              />
            </section>
            <section>
              <Label>{location.message || "lokasi"}</Label>
              <CustomSelect
                options={lokasi}
                classNamePrefix={"Select"}
                defaultValue={lokasi[0]}
                className="forBuatLapor"
                value={lokasi[location]}
                onChange={(e) => switchSelect("location", e)}
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
              <Preview>
                {isPic && <img src={isPic.file} />}
                {isPic ? isPic.name : "Klik tambah gambar diatas"}
              </Preview>
            </section>
          </div>
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}
