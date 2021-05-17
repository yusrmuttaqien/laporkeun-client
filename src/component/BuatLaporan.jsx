import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import composeRefs from "@seznam/compose-react-refs";
import { useState as GlobalState } from "@hookstate/core";

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
import { typeSelect, FetchBuatLapor } from "util/Fetches";
import { compressIMG } from "util/Helper";
import { Public, NoPublic, Trashbin, Warning } from "style/Icons";
import {
  SchemaLaporan,
  SUPPORTED_FORMATS,
  FILE_SIZE,
} from "util/ValidationSchema";
import { LocationInstance } from "util/States";

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  position: relative;

  border: 1px solid ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  img {
    width: 90%;
    max-height: 295px;
    object-fit: contain;
    margin-bottom: 0.5em;
  }

  .text {
  }

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export default function BuatLaporan(props) {
  const state = GlobalState(LocationInstance);
  const provSelect = state.locationProv.get();
  const kotaSelect = state.locationKota.get();

  const [isPublic, setIsPublic] = useState(false);
  const [isPic, setIsPic] = useState({ err: false });
  const [type, setType] = useState({ id: 0 });
  const [locationProv, setLocationProv] = useState({
    id: 0,
  });
  const [locationKota, setLocationKota] = useState({
    id: 0,
  });

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(SchemaLaporan),
  });

  const inputFile = useRef();

  const switchVis = () => {
    setIsPublic((prev) => !prev);
  };

  const switchSelect = (action, e) => {
    switch (action) {
      case "type":
        setType({ id: e.id });
        break;
      case "locationProv":
        setLocationProv({ id: e.id_index });
        setLocationKota({ id: 0 });
        FetchBuatLapor({ action: "kotaFetch", ext: { id: e.id_value } });
        break;
      case "locationKota":
        setLocationKota({ id: e.id_index });
        break;
      default:
        break;
    }
  };

  const checkSelect = () => {
    if (type.id === 0 && locationProv.id === 0) {
      setType({ id: 0, message: "tipe wajib diisi" });
      setLocationProv({ id: 0, message: "provinsi wajib diisi" });
      return 0;
    }

    if (type.id === 0 && locationKota.id === 0) {
      setType({ id: 0, message: "tipe wajib diisi" });
      setLocationKota({ id: 0, message: "kota wajib diisi" });
      return 0;
    }

    if (type.id === 0) {
      setType({ id: 0, message: "tipe wajib diisi" });
      return 0;
    }

    if (locationProv.id === 0) {
      setLocationProv({ id: 0, message: "provinsi wajib diisi" });
      return 0;
    }

    if (locationKota.id === 0) {
      setLocationKota({ id: 0, message: "kota wajib diisi" });
      return 0;
    }

    return 1;
  };

  const previewPic = async (e) => {
    const isValid = SUPPORTED_FORMATS.includes(e.target.files[0].type);
    const isHuge = e.target.files[0].size > FILE_SIZE;

    if (!isValid) {
      await setIsPic((prev) => ({
        err: true,
        name: `${e.target.files[0].name}, tidak didukung`,
      }));
      e.target.value = "";
      return 0;
    }

    if (isHuge) {
      await setIsPic((prev) => ({
        err: true,
        name: `${e.target.files[0].name}, terlalu besar`,
      }));
      e.target.value = "";
      return 0;
    }

    const preview = await compressIMG({
      file: e.target.files[0],
      height: 500,
      format: "JPEG",
      output: "base64",
    });

    setIsPic({
      err: false,
      file: preview,
      name: e.target.files[0].name,
    });
  };

  const deletePic = () => {
    const e = inputFile.current;

    setIsPic();

    e.value = "";

    if (!/safari/i.test(navigator.userAgent)) {
      e.type = "";
      e.type = "file";
    }
  };

  const cleanForm = () => {
    reset();
    setIsPic();
    setType({ id: 0 });
    setLocationProv({ id: 0 });
    setLocationKota({ id: 0 });
  };

  const handleLaporan = (laporan) => {
    if (!checkSelect()) return 0;

    FetchBuatLapor({
      action: "submitLaporan",
      ext: {
        ...laporan,
        type,
        locationProv,
        locationKota,
        isPublic,
        formReset: cleanForm,
      },
    });
  };

  useEffect(() => {
    FetchBuatLapor({ action: "effectFetch" });
  }, []);

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            <Button>
              <Label className="forButton" htmlFor="picLaporan">
                {isPic?.file ? "Ubah gambar" : "Tambah gambar"}
              </Label>
              <Input
                type="file"
                name="picLaporan"
                id="picLaporan"
                accept="image/png,image/gif,image/jpeg,image/jpg,image/webp;capture=camera"
                form="lapor"
                onChange={previewPic}
                ref={composeRefs(register, inputFile)}
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
            <section className="forBuatLaporType">
              <Label>{type.message || "tipe laporan"}</Label>
              <CustomSelect
                options={typeSelect}
                classNamePrefix={"Select"}
                defaultValue={typeSelect[0]}
                className="forBuatLapor"
                value={typeSelect[type.id]}
                onChange={(e) => switchSelect("type", e)}
              />
            </section>
            <section>
              <Label>
                {locationProv.message || locationKota.message || "lokasi"}
              </Label>
              <div className="forBuatLaporNest">
                <section>
                  <CustomSelect
                    options={provSelect}
                    classNamePrefix={"Select"}
                    defaultValue={provSelect[0]}
                    className="forBuatLapor"
                    value={provSelect[locationProv.id]}
                    onChange={(e) => switchSelect("locationProv", e)}
                  />
                </section>
                <section>
                  <CustomSelect
                    options={kotaSelect}
                    classNamePrefix={"Select"}
                    defaultValue={kotaSelect[0]}
                    className="forBuatLapor"
                    value={kotaSelect[locationKota.id]}
                    isDisabled={locationProv.id === 0}
                    onChange={(e) => switchSelect("locationKota", e)}
                  />
                </section>
              </div>
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
              <Label>{errors.picLaporan?.message || "pratinjau gambar"}</Label>
              <Preview>
                {isPic?.file && (
                  <>
                    <Button
                      className="normalizeForButton forBuatLaporPreview"
                      onClick={deletePic}
                      type="button"
                      title="Hapus gambar"
                    >
                      <Trashbin className="inButton" />
                    </Button>
                    <img
                      src={isPic?.file}
                      alt="imgPreview"
                      onError={() => console.log("crap")}
                    />
                  </>
                )}
                {isPic?.err && <Warning className="inAction" />}
                <div className="text">
                  {isPic?.name ? isPic?.name : "Klik tambah gambar diatas"}
                </div>
              </Preview>
            </section>
          </div>
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}
