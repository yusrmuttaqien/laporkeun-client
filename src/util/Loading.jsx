import React from "react";
import rfs from "rfsjs";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import { GlobalStateUI, UIInstance } from "util/States";

const Presisting = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  z-index: 1005;
  background-color: ${(props) => props.theme.color.dark};
  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.medium};
  ${rfs("2em", "font-size")}
`;

function Loading() {
  const state = GlobalState(UIInstance);
  const {
    loading: { stats, message },
  } = state.get();

  return stats && <Presisting>{message}</Presisting>;
}

async function TriggerLoading({ stats, message }) {
  if (message) {
    GlobalStateUI().setLoadingMsg(message);
  }

  GlobalStateUI().setLoading(stats);
}

export { Loading, TriggerLoading };
