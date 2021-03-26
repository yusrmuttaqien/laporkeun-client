import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStoreActions } from "easy-peasy";
import { toast } from "react-hot-toast";

import { Label, Input, Warning } from "./GlobalStyling";

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

const SchemaDaftar = yup.object().shape({
  NIK: yup
    .number()
    .required("NIK wajib diisi")
    .test("len", "NIK wajib 16 angka", (val) => val.toString().length === 16)
    .typeError("NIK harus berupa angka")
    .positive("NIK berupa bilangan positif")
    .integer("NIK berupa bilangan bulat"),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

const SchemaMasuk = yup.object().shape({
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
  name: yup.string().required("Nama wajib diisi"),
});

function FormMasuk({ toggleFormDefault }) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaMasuk),
  });
  const { masukApp } = useStoreActions((actions) => ({
    masukApp: actions.masukApp,
  }));

  const switching = () => {
    toggleFormDefault();
  };

  const onSubmit = (data) => {
    toast.promise(masukApp(data), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => msg,
      error: (err) => err && err.toString(),
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
        <button type="submit">Masuk</button>
        <p onClick={() => switching()}>belum punya akun nih!</p>
      </Form>
    </FormWrapper>
  );
}

function FormDaftar({ toggleFormDefault }) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaDaftar),
  });
  const { penggunaRegistration } = useStoreActions((actions) => ({
    penggunaRegistration: actions.penggunaRegistration,
  }));

  const switching = () => {
    toggleFormDefault();
  };

  const onSubmit = (data) => {
    toast.promise(penggunaRegistration(data), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => msg,
      error: (err) => err && err.toString(),
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
        <Input type="number" name="NIK" id="NIK" ref={register} />
        <Warning>{errors.NIK?.message}</Warning>
        <Label htmlFor="kataSandi">Kata sandi</Label>
        <Input type="password" name="kataSandi" id="kataSandi" ref={register} />
        <Warning>{errors.kataSandi?.message}</Warning>
        <button type="submit">Daftar</button>
        <p onClick={() => switching()}>udah punya akun nih!</p>
      </Form>
    </FormWrapper>
  );
}

export { FormMasuk, FormDaftar };
