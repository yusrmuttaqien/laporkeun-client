import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useStoreActions } from "easy-peasy";
import { useHistory } from "react-router-dom";

import {
  Label,
  Input,
  TextArea,
  ReportWrapper,
  Report,
  ReportBody,
  Action,
  Button,
  Warning,
} from "./GlobalStyling";

const ReportHeader = styled.div`
  display: flex;
  align-items: flex-end;

  section {
    display: inherit;
    flex-direction: column;
    flex: 1;

    &:nth-child(2) {
      margin-left: 1em;
    }
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-last-child(1) {
    margin-left: 1em;
  }
`;

const CustomInput = styled.input`
  display: none;
`;

const CustomLabel = styled.label`
  appearance: none;
  cursor: pointer;
`;

// NOTE: Deprecated API
const AlteredReport = Report.withComponent("form");

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const SchemaLaporan = yup.object().shape({
  judulLaporan: yup
    .string()
    .required("Judul wajib diisi")
    .max(30, "Judul maksimal 30 karakter"),
  loc: yup
    .string()
    .required("Lokasi wajib diisi")
    .max(30, "Lokasi maksimal 30 karakter"),
  isiLaporan: yup
    .string()
    .required("Isi wajib diisi")
    .max(2000, "Isi maksimal 2000 karakter"),
  pic: yup
    .mixed()
    .test("fileType", "Unsupported File Format", (value) => {
      if (value.length !== 0 && !SUPPORTED_FORMATS.includes(value[0].type)) {
        return false;
      } else {
        return true;
      }
    })
    .test("fileSize", "File Size is too large", (value) => {
      if (value.length !== 0 && value[0].size >= FILE_SIZE) {
        return false;
      } else {
        return true;
      }
    }),
});

function BuatLaporan() {
  const [action, setAction] = useState("Privat");
  const [filename, setFileName] = useState("");
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaLaporan),
  });
  const { newReport } = useStoreActions((actions) => ({
    newReport: actions.newReport,
  }));

  const changeAction = () => {
    setAction(action === "Privat" ? "Publik" : "Privat");
  };
  const history = useHistory();

  const onSubmit = async (data, e) => {
    const datas = { ...data, vis: action };
    toast.promise(newReport(datas), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => {
        history.push("/laporanku");
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  const getFileName = (e) => {
    setFileName(e.target.files[0].name);
  };

  return (
    <ReportWrapper>
      <AlteredReport noValidate onSubmit={handleSubmit(onSubmit)}>
        <h1>buat laporanmu</h1>
        <ReportHeader>
          <section>
            <Label htmlFor="judulLaporan">
              judul laporan <Warning>{errors.judulLaporan?.message}</Warning>
            </Label>
            <Input
              type="text"
              name="judulLaporan"
              id="judulLaporan"
              ref={register}
            />
          </section>
          <section>
            <Label htmlFor="loc">
              lokasi laporan <Warning>{errors.loc?.message}</Warning>
            </Label>
            <Input
              type="text"
              name="loc"
              id="loc"
              ref={register}
            />
          </section>
          <ActionCustom title="Ubah visibilitas" onClick={() => changeAction()}>
            <span className="material-icons">
              {action === "Publik" ? "public" : "public_off"}
            </span>
            {action === "Publik" ? "Publik" : "Privat"}
          </ActionCustom>
        </ReportHeader>
        <ReportBodyCustom>
          <Label htmlFor="isiLaporan">
            isi laporan <Warning>{errors.isiLaporan?.message}</Warning>
          </Label>
          <TextArea name="isiLaporan" id="isiLaporan" ref={register}></TextArea>
          <section>
            <CustomButton
              type="button"
              title={
                errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Tambahkan gambar"
              }
            >
              <CustomLabel htmlFor="pic">
                {errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Tambahkan gambar"}
              </CustomLabel>
              <CustomInput
                type="file"
                name="pic"
                id="pic"
                accept="image/x-png,image/gif,image/jpeg"
                ref={register}
                onChange={getFileName}
              />
            </CustomButton>
            <CustomButton type="submit" title="Lapor!">
              Lapor!
            </CustomButton>
          </section>
        </ReportBodyCustom>
      </AlteredReport>
    </ReportWrapper>
  );
}

export default BuatLaporan;
