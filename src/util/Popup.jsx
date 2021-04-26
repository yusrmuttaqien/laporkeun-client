import React from "react";
import styled from "styled-components";
import rfs from "rfsjs";
import { useState as GlobalState } from "@hookstate/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { GlobalStatePopup, PPInstance, PopupTemplate } from "util/States";
import { Button, Label, Input, Warning } from "style/Components";
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

const FormWrapper = styled.form`
  display: inherit;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin-top: 1em;
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
        <Content>
          {message}
          {form && (
            <FormWrapper id="confirm" onSubmit={handleSubmit(handleYes)}>
              <Label htmlFor="input">{txtLabel}</Label>
              <Input type="text" name="input" id="input" ref={register} />
              <Warning>{errors.input?.message}</Warning>
            </FormWrapper>
          )}
        </Content>
        <Action>
          <CustomButton02 type="submit" form="confirm">
            {txtYes}
          </CustomButton02>
          <CustomButton02 onClick={handleNo}>{txtNo}</CustomButton02>
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

  GlobalStatePopup().settxtYes(txtYes);
  GlobalStatePopup().settxtNo(txtNo);
  GlobalStatePopup().setLabel(txtLabel);
  GlobalStatePopup().setMsg(content);
  GlobalStatePopup().setForm(form);
  await GlobalStatePopup().setPopup(true);
  handleFocus();
}

export { Popup, TriggerPopup };
