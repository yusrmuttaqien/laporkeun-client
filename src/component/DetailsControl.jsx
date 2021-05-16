import React from "react";
import styled from "styled-components";

import { Button } from "style/Components";
import { Exit } from "style/Icons";

const Control = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .multiOption {
    display: inherit;
    align-items: center;

    button:not(:first-child) {
      margin-left: 0.5em;
    }
  }
`;

const Title = styled.h1`
  align-self: flex-end;

  font-size: 1.1rem;
  font-weight: ${(props) => props.theme.value.font.normal};
`;

export default function DetailsControl() {
  return (
    <Control>
      <Button className="normalizeForButton">
        <Exit className="inButton" />
      </Button>
      <Title>Ya jadi gitu</Title>
      <div className="multiOption">
        <Button>unduh</Button>
        <Button>hapus</Button>
      </div>
    </Control>
  );
}
