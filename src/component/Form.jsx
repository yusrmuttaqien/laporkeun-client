import React from "react";
import styled from "styled-components";

import { Label, Input } from "./GlobalStyling";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  }
`;

// TODO: Add ReduxForm validation
// TODO: Add dynamics with redux
function FormMasuk() {
  return (
    <FormWrapper>
      <Judul>Masuk dulu gan!</Judul>
      <Form>
        <Label htmlFor="namaNIK">Nama atau NIK</Label>
        <Input type="text" name="namaNIK" id="namaNIK" />
        <Label htmlFor="nama">Nama</Label>
        <Input type="text" name="nama" id="nama" />
        <Label htmlFor="NIK">NIK</Label>
        <Input type="number" name="NIK" id="NIK" />
        <Label htmlFor="kataSandi">Kata sandi</Label>
        <Input type="password" name="kataSandi" id="kataSandi" />
        <button type="submit">Masuk</button>
        <p>belum punya akun nih!</p>
      </Form>
    </FormWrapper>
  );
}

export { FormMasuk };
