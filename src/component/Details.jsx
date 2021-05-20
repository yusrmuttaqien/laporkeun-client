import React, { useEffect } from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";
import { useHistory } from "react-router-dom";

import Control from "component/DetailsControl";
import Content from "component/DetailsContent";
import { Overlay } from "style/Components";
import { GlobalStateD, DInstance } from "util/States";
import { FetchDetails } from "util/Fetches";

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  top: 0;
  right: 0;
  height: inherit;
  min-height: inherit;
  width: ${(props) => props.theme.value.UI.Details};
  padding: 20px 30px;

  z-index: 1002;
  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  color: ${(props) => props.theme.color.white};
  transform: ${(props) =>
    props.stats ? "translateX(0%)" : "translateX(100%)"};
  transition: ${(props) => props.theme.value.transition};
  transition-property: transform;
  will-change: transition;
`;

function Details() {
  const state = GlobalState(DInstance);
  const { stats } = state.get();

  let history = useHistory();

  useEffect(() => {
    return () => {
      if (stats) {
        if (history.action === "POP") {
          GlobalStateD().setD(false);
        }
      }
    };
  }, [history.action, stats]);

  return (
    <>
      {stats && <Overlay onClick={() => state.stats.set(false)} />}
      <DetailsWrapper stats={stats}>
        <Control />
        <Content />
      </DetailsWrapper>
    </>
  );
}

async function TriggerDetails({ id }) {
  GlobalStateD().setLoading(true);
  GlobalStateD().setD(true);
  await FetchDetails({ ext: id });
  GlobalStateD().setLoading(false);
}

export { Details, TriggerDetails };
