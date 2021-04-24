import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useState as GlobalState } from "@hookstate/core";

import { Label, Input, Warning } from "style/Components";
import { SchemaDaftar, SchemaMasuk } from "util/ValidationSchema";
import { regisPengguna, login } from "util/DataFetch";
import { DataInstance } from "util/States";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 200px;
`;

const Judul = styled.h2`
  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.medium};
  font-size: 1.7rem;

  margin-bottom: 0.5em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  button {
    font-weight: ${(props) => props.theme.value.font.medium};
    font-size: 1rem;
    border-radius: ${(props) => props.theme.value.radius};
    outline: none;
    border: none;
    transition: ${(props) => props.theme.value.transition};
    transition-property: background-color, color;

    padding: 0.3em 0;
    margin: 0.5em 0;

    &:hover {
      color: ${(props) => props.theme.color.white};
      background-color: ${(props) => props.theme.color.dark};
      cursor: pointer;
    }
  }

  p {
    color: ${(props) => props.theme.color.white};
    font-weight: ${(props) => props.theme.value.font.light};
    text-align: center;
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
  }
`;

function FormMasuk() {
  const state = GlobalState(DataInstance);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaMasuk)
  });

  const switching = () => {
    state.forms.set("Daftar");
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    toast.promise(login(data), {
      loading: "Tunggu sebentar",
      success: (msg) => msg,
      error: (err) => {
        setIsLoading(false);
        return err && err.toString();
      },
    });
  };

  return (
    <FormWrapper>
      <Judul>Masuk dulu gan!</Judul>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="name">Nama</Label>
        <Input type="text" name="name" id="name" ref={register} />
        <Warning>{errors.name?.message}</Warning>
        <Label htmlFor="kataSandi">Kata sandi</Label>
        <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
        <Warning>{errors.kataSandi?.message}</Warning>
        <button type="submit" disabled={isLoading}>
          Masuk
        </button>
        <p onClick={() => switching()}>belum punya akun nih!</p>
      </Form>
    </FormWrapper>
  );
}

function FormDaftar() {
  const state = GlobalState(DataInstance);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaDaftar),
  });

  const switching = () => {
    state.forms.set("Masuk");
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    toast.promise(regisPengguna(data), {
      loading: "Tunggu sebentar",
      success: (msg) => msg,
      error: (err) => {
        setIsLoading(false);
        return err && err.toString();
      },
    });
  };

  return (
    <FormWrapper>
      <Judul>Daftar dulu gan!</Judul>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="name">Nama</Label>
        <Input type="text" name="name" id="name" ref={register} />
        <Warning>{errors.name?.message}</Warning>
        <Label htmlFor="NIK">NIK</Label>
        <Input type="text" name="NIK" id="NIK" ref={register} />
        <Warning>{errors.NIK?.message}</Warning>
        <Label htmlFor="kataSandi">Kata sandi</Label>
        <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
        <Warning>{errors.kataSandi?.message}</Warning>
        <button type="submit" disabled={isLoading}>
          Daftar
        </button>
        <p onClick={() => switching()}>udah punya akun nih!</p>
      </Form>
    </FormWrapper>
  );
}

export default function Forms() {
  const state = GlobalState(DataInstance).forms.get();
  return state === "Masuk" ? <FormMasuk /> : <FormDaftar />;
}
