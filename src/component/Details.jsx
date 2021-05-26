import React, { useEffect, useState } from "react";
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
  visibility: ${(props) => (props.stats ? "unset" : "hidden")};
  transition-property: transform, visibility;
  will-change: transition, visibility;
`;

function Details() {
  const [locationKeys, setLocationKeys] = useState([]);

  const state = GlobalState(DInstance);
  const { stats } = state.get();

  let history = useHistory();

  const handleBlur = () => {
    state.stats.set(false);
  };

  useEffect(() => {
    return history.listen((location) => {
      if (stats) {
        if (history.action === "PUSH") {
          setLocationKeys([location.key]);
        }

        if (history.action === "POP") {
          if (locationKeys[1] === location.key) {
            setLocationKeys(([_, ...keys]) => keys);
            GlobalStateD().setResetD();
          } else {
            setLocationKeys((keys) => [location.key, ...keys]);
            GlobalStateD().setResetD();
          }
        }
      }
    });
  }, [locationKeys, history, stats]);

  return (
    <>
      {stats && <Overlay index="1001" onClick={handleBlur} />}
      <DetailsWrapper stats={stats} aria-hidden={!stats}>
        <Control />
        <Content />
      </DetailsWrapper>
    </>
  );
}

async function TriggerDetails({ id, action }) {
  if (
    GlobalStateD().getData() === null ||
    GlobalStateD().getData()?.id !== id
  ) {
    await GlobalStateD().setResetD();
    await GlobalStateD().setLoading(true);
    FetchDetails({ ext: id, action });
  }
  
  GlobalStateD().setD(true);
  GlobalStateD().setLoading(false);
}

export { Details, TriggerDetails };
