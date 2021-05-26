import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import {
  ReportBody,
  Form,
  Label,
  Input,
  Warning,
  Button,
} from "style/Components";
import { SchemaDaftarPetugas } from "util/ValidationSchema";
import { regisPetugas } from "util/MainFunctions";

export default function PetugasRegistrasi() {
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(SchemaDaftarPetugas),
  });

  const onSubmit = (data) => {
    toast.promise(regisPetugas(data), {
      loading: "Tunggu sebentar kawan",
      success: (msg) => {
        reset();
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  return (
    <ReportBody className="forPetugasRegis">
      <Form className="forPetugasRegis" onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="name">Nama</Label>
        <Input type="text" name="name" id="name" ref={register} />
        <Warning>{errors.name?.message}</Warning>
        <Label htmlFor="telp">Nomor telp</Label>
        <Input type="text" name="telp" id="telp" ref={register} />
        <Warning>{errors.telp?.message}</Warning>
        <Label htmlFor="kataSandi">Kata sandi</Label>
        <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
        <Warning>{errors.kataSandi?.message}</Warning>
        <Button type="submit">Daftarkan petugas</Button>
      </Form>
    </ReportBody>
  );
}
