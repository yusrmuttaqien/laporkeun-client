import React from "react";
import styled from "styled-components";
import rfs from "rfsjs";
import { useState as GlobalState } from "@hookstate/core";

import { GlobalStatePopup, PPInstance, PopupTemplate } from "util/States";
import { Button } from "style/Components";

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 5px;
  left: 50%;
  ${rfs("20rem", "min-width")};
  ${rfs("10rem", "min-height")};

  transform: translateX(-50%);
  color: ${(props) => props.theme.color.white};
  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  border-radius: ${(props) => props.theme.value.radius};
  transition: ${(props) => props.theme.value.transition};
  z-index: 1003;
`;

const Content = styled.div`
  display: inherit;
  align-items: center;
  justify-content: center;
  flex: 1;

  width: 100%;
  padding: 0 1em;
`;

const Action = styled.div`
  display: inherit;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 55px;
  padding: 0 1em;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 1002;
`;

const CustomButton02 = styled(Button)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-child(2) {
    margin-left: 1em;
  }
`;

var callbackYes, callbackNo;

function Popup() {
  const state = GlobalState(PPInstance);
  const { mode, message, stats, txtYes, txtNo } = state.get();

  const defaultCb = () => {
    return null;
  };

  const handleBlur = () => {
    state.set({ ...PopupTemplate });
  };

  const handleYes = (userAction) => {
    // Call the user defined callback, if there is
    callbackYes({ agreement: true, userAction });

    // Clean up callback
    callbackYes = defaultCb;
    callbackNo = defaultCb;

    // Cleanup popup state
    state.set({ ...PopupTemplate });
  };

  const handleNo = (userAction) => {
    // Call the user defined callback, if there is
    callbackNo({ agreement: false, userAction });

    // Clean up callback
    callbackYes = defaultCb;
    callbackNo = defaultCb;

    // Cleanup popup state
    state.set({ ...PopupTemplate });
  };

  if (!callbackYes) {
    callbackYes = defaultCb;
  }

  if (!callbackNo) {
    callbackNo = defaultCb;
  }

  return stats ? (
    <>
      <Overlay onClick={handleBlur} />
      <PopupWrapper id="ydhm-popup" tabIndex="0">
        <Content>{message}</Content>
        <Action>
          <CustomButton02 type="submit" form="confirm" onClick={handleYes}>
            {txtYes}
          </CustomButton02>
          <CustomButton02 onClick={handleNo}>{txtNo}</CustomButton02>
        </Action>
      </PopupWrapper>
    </>
  ) : null;
}

async function TriggerPopup({
  mode = "notify",
  content = "I'm default, add new content please",
  cbYes,
  cbNo,
  txtYes,
  txtNo,
}) {
  const handleFocus = () => {
    document.getElementById("ydhm-popup").focus();
  };

  if (cbYes) {
    callbackYes = cbYes;
  }

  if (cbNo) {
    callbackNo = cbNo;
  }

  if (txtYes) {
    GlobalStatePopup().settxtYes(txtYes);
  }

  if (txtNo) {
    GlobalStatePopup().settxtNo(txtNo);
  }

  GlobalStatePopup().setMsg(content);
  GlobalStatePopup().setMode(mode);
  await GlobalStatePopup().setPopup(true);
  handleFocus();
}

export { Popup, TriggerPopup };
