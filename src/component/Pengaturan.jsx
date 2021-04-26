import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState as GlobalState } from "@hookstate/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  ReportWrapper,
  Report,
  Button,
  Label,
  Input,
  Warning,
} from "style/Components";
import { TriggerPopup } from "util/Popup";
import { DataInstance } from "util/States";
import { SchemaSetting } from "util/ValidationSchema";
import { updateProfile, deleteAccount } from "util/DataFetch";

import defaultUser from "asset/defaultUser.svg";

const CustomReport = styled(Report)`
  .reportHeader {
    display: inherit;
    align-items: center;
    justify-content: space-between;

    h1 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const SettingWrapper = styled.form`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;

  section {
    display: inherit;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      width: 60%;

      img {
        width: 50%;
        margin-bottom: 2em;
        border-radius: 50%;
      }
    }

    &:nth-child(2) {
      flex: 1;
    }
  }
`;

const CustomButton = styled(Button)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CustomButton02 = styled(Button)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-child(2) {
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

const CustomFormWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 60%;
`;

export default function Pengaturan() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const state = GlobalState(DataInstance);
  const { pic, name, telp, picURL } = state.session.get();

  const [filename, setFileName] = useState("");
  const [aspectRatio, setAspectRatio] = useState();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaSetting),
    context: { aspectRatio },
  });

  const getFileName = (e) => {
    setFileName(e.target.files[0].name);
    const reader = new Image();
    reader.onload = async () => {
      await setAspectRatio(reader.height / reader.width);
    };
    reader.src = window.URL.createObjectURL(e.target.files[0]);
  };

  const onSubmit = (data) => {
    const next = (cred) => {
      const key = cred.userAction.input;
      const sessionData = { pic, name, telp };
      toast.promise(updateProfile({ data, sessionData, key }), {
        loading: "Tunggu sebentar kawan",
        success: (msg) => msg,
        error: (err) => err && err.toString(),
      });
    };

    TriggerPopup({
      form: true,
      content: "Simpan perubahan?",
      txtYes: "Simpan",
      txtNo: "Batalkan",
      txtLabel: "Kata sandi",
      cbYes: next,
      cbNo: () => toast.success("Dibatalkan"),
    });
  };

  const onDelete = () => {
    TriggerPopup({
      form: true,
      content: "Anda yakin ingin menghapus akun?",
      txtYes: "Ya",
      txtNo: "Tidak jadi",
      txtLabel: "Kata sandi",
      cbYes: deleteAccount,
      cbNo: () => toast.success("Dibatalkan"),
    });
  };

  return (
    <ReportWrapper>
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <section>
            <CustomButton02 onClick={onDelete}>Hapus akun</CustomButton02>
            <CustomButton02 type="submit" form="changeSetting">
              Simpan
            </CustomButton02>
          </section>
        </div>
        <SettingWrapper
          id="changeSetting"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <section>
            <img src={picURL ? picURL : defaultUser} alt="" />
            <CustomButton
              type="button"
              title={
                errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"
              }
            >
              <CustomLabel htmlFor="pic">
                {errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"}
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
          </section>
          <section>
            <CustomFormWrapper>
              <Label htmlFor="name">Nama</Label>
              <Input
                type="text"
                name="name"
                id="name"
                ref={register}
                defaultValue={name}
              />
              <Warning>{errors.name?.message}</Warning>
              <Label htmlFor="telp">Telp</Label>
              <Input
                type="txt"
                name="telp"
                id="telp"
                ref={register}
                defaultValue={telp && telp}
              />
              <Warning>{errors.telp?.message}</Warning>
              <Label htmlFor="kataSandi">Kata sandi</Label>
              <Input
                type="password"
                name="kataSandi"
                id="kataSandi"
                ref={register}
              />
              <Warning>{errors.kataSandi?.message}</Warning>
            </CustomFormWrapper>
          </section>
        </SettingWrapper>
      </CustomReport>
    </ReportWrapper>
  );
}
