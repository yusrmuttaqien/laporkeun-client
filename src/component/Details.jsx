import React from "react";
import styled from "styled-components";

import Control from "component/DetailsControl";
import Content from "component/DetailsContent";
import { Overlay } from "style/Components";

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
`;

function Details() {
  return (
    <>
      <Overlay />
      <DetailsWrapper>
        <Control />
        <Content />
      </DetailsWrapper>
    </>
  );
}

async function TriggerDetails({}) {}

export { Details, TriggerDetails };
