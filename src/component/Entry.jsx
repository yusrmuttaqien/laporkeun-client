import React, { useState } from "react";
import styled from "styled-components";

import EntryLogin from "./EntryLogin";
import EntryRegis from "./EntryRegis";

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

export default function Forms() {
  const [isRegis, setIsRegis] = useState(false);

  return (
    <FormWrapper>
      <Judul>Daftar dulu gan!</Judul>
      {isRegis ? (
        <EntryRegis toggle={setIsRegis} />
      ) : (
        <EntryLogin toggle={setIsRegis} />
      )}
    </FormWrapper>
  );
}
