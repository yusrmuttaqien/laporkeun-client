import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { Label, Input, Warning, Form, Button } from "style/Components";
import { SchemaMasuk } from "util/ValidationSchema";
import { login } from "util/MainFunctions";

export default function EntryLogin(props) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaMasuk),
  });

  const switching = () => {
    props.toggle((prev) => !prev);
  };

  const onSubmit = (data) => {
    setIsLoading(true);

    toast.promise(login(data), {
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
      <Label htmlFor="kataSandi">Kata sandi</Label>
      <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
      <Warning>{errors.kataSandi?.message}</Warning>
      <Button className="forEntry" disabled={isLoading} type="submit">
        Masuk
      </Button>
      <p onClick={switching}>belum punya akun nih!</p>
    </Form>
  );
}
