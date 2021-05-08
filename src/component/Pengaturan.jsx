import React, { useState } from "react";
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
  ReportBody,
  Form,
} from "style/Components";
import { TriggerPopup } from "util/Popup";
import { DataInstance } from "util/States";
import { SchemaSetting } from "util/ValidationSchema";
import { updateProfile, deleteAccount } from "util/MainFunctions";

import defaultUser from "asset/defaultUser.svg";

export default function Pengaturan(props) {
  const state = GlobalState(DataInstance);
  const { pic, name, telp, picURL, role } = state.session.get();

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
    const next = (cred) => {
      const key = cred.userAction.input;
      toast.promise(deleteAccount(key), {
        loading: "Tunggu sebentar kawan",
        success: (msg) => msg,
        error: (err) => err && err.toString(),
      });
    };

    TriggerPopup({
      form: true,
      content: "Anda yakin ingin menghapus akun?",
      txtYes: "Ya",
      txtNo: "Tidak jadi",
      txtLabel: "Kata sandi",
      cbYes: next,
      cbNo: () => toast.success("Dibatalkan"),
    });
  };

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            {role === "pengguna" && (
              <Button onClick={onDelete}>Hapus akun</Button>
            )}
            <Button type="submit" form="changeSetting">
              Simpan
            </Button>
          </div>
        </div>
        <ReportBody className="forSettings">
          <section>
            <img src={picURL ? picURL : defaultUser} alt="" />
            <Button
              type="button"
              title={
                errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"
              }
              form="changeSetting"
            >
              <Label htmlFor="pic" className="forButton">
                {errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"}
              </Label>
              <Input
                type="file"
                name="pic"
                id="pic"
                accept="image/x-png,image/gif,image/jpeg"
                className="forFile"
                ref={register}
                onChange={getFileName}
              />
            </Button>
          </section>
          <section>
            <Form
              id="changeSetting"
              noValidate
              className="forSettings"
              onSubmit={handleSubmit(onSubmit)}
            >
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
            </Form>
          </section>
        </ReportBody>
      </Report>
    </ReportWrapper>
  );
}
