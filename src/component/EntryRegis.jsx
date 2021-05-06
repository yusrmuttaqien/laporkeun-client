import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { Label, Input, Warning, Form, Button } from "style/Components";
import { SchemaDaftar } from "util/ValidationSchema";
import { regisPengguna } from "util/MainFunctions";

export default function EntryRegis(props) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaDaftar),
  });

  const switching = () => {
    props.toggle((prev) => !prev);
  };

  const onSubmit = (data) => {
    setIsLoading(true);

    toast.promise(regisPengguna(data), {
      loading: "Tunggu sebentar",
      success: (msg) => {
        setIsLoading(false);
        return msg;
      },
      error: (err) => {
        setIsLoading(false);
        return err && err.toString();
      },
    });
  };
  return (
    <Form className="forEntry" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="name">Nama</Label>
      <Input type="text" name="name" id="name" ref={register} />
      <Warning>{errors.name?.message}</Warning>
      <Label htmlFor="NIK">NIK</Label>
      <Input type="text" name="NIK" id="NIK" ref={register} />
      <Warning>{errors.NIK?.message}</Warning>
      <Label htmlFor="kataSandi">Kata sandi</Label>
      <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
      <Warning>{errors.kataSandi?.message}</Warning>
      <Button className="forEntry" disabled={isLoading} type="submit">
        Daftar
      </Button>
      <p onClick={switching}>udah punya akun nih!</p>
    </Form>
  );
}
