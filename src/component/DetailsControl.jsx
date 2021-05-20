import React from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import { Button } from "style/Components";
import { Exit } from "style/Icons";
import { DInstance } from "util/States";

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

export default function DetailsControl(props) {
  const state = GlobalState(DInstance);
  const { data, loading } = state.get();

  return (
    <Control>
      <Button className="normalizeForButton" onClick={() => state.stats.set(false)}>
        <Exit className="inButton" />
      </Button>
      {!loading && (
        <>
          <Title>{data?.title}</Title>
          <div className="multiOption">
            <Button>unduh</Button>
            <Button>hapus</Button>
            <Button>respon</Button>
          </div>
        </>
      )}
    </Control>
  );
}
