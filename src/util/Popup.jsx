import React from "react";
import styled from "styled-components";
import rfs from "rfsjs";
import { useState as GlobalState } from "@hookstate/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { GlobalStatePopup, PPInstance, PopupTemplate } from "util/States";
import { Button, Label, Input, Warning, Form, Overlay } from "style/Components";
import { SchemaPopup } from "util/ValidationSchema";

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 5px;
  left: 50%;
  ${rfs("20rem", "min-width")};
  ${rfs("10rem", "min-height")};
  padding: 1.5em 0 0.5em;

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
  flex-direction: column;
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

var callbackYes, callbackNo, addParam;

function Popup() {
  const state = GlobalState(PPInstance);
  const { form, message, stats, txtYes, txtNo, txtLabel } = state.get();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaPopup),
  });

  const defaultCb = () => {
    return null;
  };

  const handleBlur = () => {
    state.set({ ...PopupTemplate });
  };

  const handleYes = (userAction) => {
    // Call the user defined callback, if there is
    callbackYes({ agreement: true, userAction, ...addParam });

    // Clean up callback
    callbackYes = defaultCb;
    callbackNo = defaultCb;
    addParam = null;

    // Cleanup popup state
    state.set({ ...PopupTemplate });
  };

  const handleNo = (userAction) => {
    // Call the user defined callback, if there is
    callbackNo({ agreement: false, userAction, ...addParam });

    // Clean up callback
    callbackYes = defaultCb;
    callbackNo = defaultCb;
    addParam = null;

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
      <Overlay onClick={handleBlur} index="1002" />
      <PopupWrapper id="ydhm-popup" tabIndex="0">
        <Content>
          {message}
          {form && (
            <Form
              className="forPopup"
              id="confirm"
              onSubmit={handleSubmit(handleYes)}
            >
              <Label htmlFor="input">{txtLabel}</Label>
              <Input type="text" name="input" id="input" ref={register} />
              <Warning>{errors.input?.message}</Warning>
            </Form>
          )}
        </Content>
        <Action>
          {form ? (
            <Button className="forPopup" type="submit" form="confirm">
              {txtYes}
            </Button>
          ) : (
            <Button className="forPopup" onClick={handleYes}>
              {txtYes}
            </Button>
          )}
          <Button className="forPopup" onClick={handleNo}>
            {txtNo}
          </Button>
        </Action>
      </PopupWrapper>
    </>
  ) : null;
}

async function TriggerPopup({
  form,
  content = "I'm default, add new content please",
  cbYes,
  cbNo,
  txtYes = "Ok",
  txtNo = "Cancel",
  txtLabel = "Add a label",
  param,
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

  if (param) {
    addParam = param;
  }

  GlobalStatePopup().settxtYes(txtYes);
  GlobalStatePopup().settxtNo(txtNo);
  GlobalStatePopup().setLabel(txtLabel);
  GlobalStatePopup().setMsg(content);
  GlobalStatePopup().setForm(form);
  await GlobalStatePopup().setPopup(true);
  handleFocus();
}

export { Popup, TriggerPopup };
