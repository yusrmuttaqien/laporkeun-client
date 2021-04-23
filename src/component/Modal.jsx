import React from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  position: fixed;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);

  color: ${(props) => props.theme.color.white};
  background-color: ${(props) => props.theme.color.darkTransparent};
`;

function Modal() {
  return <ModalWrapper>Hello</ModalWrapper>;
}

export { Modal };
