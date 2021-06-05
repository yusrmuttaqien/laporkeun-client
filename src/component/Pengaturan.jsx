import React, { useState, useRef } from "react";
import { useState as GlobalState } from "@hookstate/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import composeRefs from "@seznam/compose-react-refs";

import {
  ReportWrapper,
  Report,
  Button,
  Label,
  Input,
  Warning,
  ReportBody,
  Form,
  Preview,
} from "style/Components";
import { TriggerPopup } from "util/Popup";
import { DataInstance } from "util/States";
import {
  SchemaSetting,
  SUPPORTED_FORMATS,
  FILE_SIZE,
} from "util/ValidationSchema";
import {
  updateProfile,
  deleteAccount,
  deleteIMGProfile,
} from "util/MainFunctions";
import { Trashbin, Warning as WarningIcon } from "style/Icons";
import { compressIMG, dimensionIMG } from "util/Helper";

export default function Pengaturan(props) {
  const state = GlobalState(DataInstance);
  const { pic, name, telp, picURL, role } = state.session.get();

  const [isPic, setIsPic] = useState({ err: false });

  // Unused pic err message
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaSetting),
    context: { aspectRatio: isPic?.aspectRatio },
  });

  const inputFile = useRef();

  const previewPic = async (e) => {
    if (e.target.files[0]) {
      const isValid = SUPPORTED_FORMATS.includes(e.target.files[0].type);
      const isHuge = e.target.files[0].size > FILE_SIZE;
      let isGoodRatio = await dimensionIMG(e.target.files[0]);
      isGoodRatio = isGoodRatio.height / isGoodRatio.width;

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

      if (isGoodRatio !== 1) {
        await setIsPic((prev) => ({
          err: true,
          name: `${e.target.files[0].name}, rasio tidak 1:1`,
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
        aspectRatio: isGoodRatio,
      });
    }
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

  const onSubmit = (data) => {
    const next = (cred) => {
      const key = cred.userAction.input;
      const sessionData = { pic, name, telp };
      toast.promise(updateProfile({ data, sessionData, key }), {
        loading: "Tunggu sebentar kawan",
        success: (msg) => {
          setIsPic();
          return msg;
        },
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
    });
  };

  const onDelete = () => {
    const next = (cred) => {
      const key = cred.userAction.input;
      toast.promise(deleteAccount(key), {
        loading: "Tunggu sebentar",
        success: (msg) => msg,
        error: (err) => err && err.toString(),
      });
    };
    
    TriggerPopup({
      form: true,
      content: "Anda yakin ingin menghapus akun?",
      txtYes: "Ya",
      txtNo: "Tidak",
      txtLabel: "Kata sandi",
      cbYes: next,
    });
  };
  
  const deleteProfileIMG = () => {
    const next = () => {
      toast.promise(deleteIMGProfile(), {
        loading: "Tunggu sebentar",
        success: (msg) => msg,
        error: (err) => err && err.toString(),
      });
    };

    TriggerPopup({
      content: "Hapus gambar profil?",
      txtYes: "Ya",
      txtNo: "Tidak",
      cbYes: next,
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
            {picURL && <Button onClick={deleteProfileIMG}>Hapus gambar</Button>}
            <Button type="submit" form="changeSetting">
              Simpan
            </Button>
          </div>
        </div>
        <ReportBody className="forSettings">
          <section>
            <Preview className="forPengaturan">
              {isPic?.file && (
                <>
                  <Button
                    className="normalizeForButton forPengaturanPreview"
                    type="button"
                    title="Hapus gambar"
                    onClick={deletePic}
                  >
                    <Trashbin className="inButton" />
                  </Button>
                  <img src={isPic?.file} alt="imgPreview" />
                </>
              )}
              {isPic?.err && <WarningIcon className="inAction" />}
              <div className="text">
                {isPic?.name
                  ? isPic?.name
                  : picURL
                  ? "Klik tombol dibawah untuk ubah gambar profil"
                  : "Klik tombol dibawah untuk tambah gambar profil"}
              </div>
              <Button>
                <Label htmlFor="pic" className="forButton">
                  {picURL || isPic?.file ? "Ubah profil" : "Tambah profil"}
                </Label>
                <Input
                  form="changeSetting"
                  type="file"
                  name="pic"
                  id="pic"
                  accept="image/png,image/gif,image/jpeg,image/jpg,image/webp;capture=camera"
                  className="forFile"
                  ref={composeRefs(register, inputFile)}
                  onChange={previewPic}
                />
              </Button>
            </Preview>
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
