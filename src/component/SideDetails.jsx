//  NOTE: Hardcoded variable
import React, { useRef } from "react";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Action, Button, Label, TextArea } from "./GlobalStyling";

import DefaultImg from "./../asset/defaultReport.jpg";

const SideDetailsWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1001;
  transform: ${(props) =>
    props.focus ? "translateX(0%)" : "translateX(100%)"};

  height: inherit;
  min-height: inherit;
  width: ${(props) => props.theme.value.UI.sideDetails};
  padding: 20px 30px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  transition: ${(props) => props.theme.value.transition};
  color: ${(props) => props.theme.color.white};
`;

const Control = styled.div`
  display: flex;
  justify-content: space-between;

  height: fit-content;
`;

const Header = styled.div`
  height: 30%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    align-self: center;

    height: 70%;
    max-width: 100%;

    object-fit: contain;
    border-radius: ${(props) => props.theme.value.radius};
  }

  section {
    h2 {
      font-weight: ${(props) => props.theme.value.font.normal};
    }

    p {
      font-weight: ${(props) => props.theme.value.font.light};
    }
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 60%;

  section {
    &:nth-child(1) {
      flex: 1;

      overflow: auto;

      margin-bottom: 0.2em;
      padding-right: 5px;

      p {
        font-weight: ${(props) => props.theme.value.font.light};
        text-align: justify;

        height: inherit;
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-direction: column;

      height: 55%;

      ${Label} {
        font-weight: ${(props) => props.theme.value.font.normal};
      }
    }
  }
`;

const CustomButton = styled(Button)`
  font-size: 0.85rem;
`;

export default function SideDetails() {
  const {
    onFocus,
    pic,
    title,
    report,
    date,
    vis,
    stat,
    response,
    role,
  } = useStoreState((state) => ({
    onFocus: state.UI.sideDetails.onFocus,
    pic: state.activeDetails.pic,
    title: state.activeDetails.title,
    report: state.activeDetails.report,
    date: state.activeDetails.date,
    vis: state.activeDetails.vis,
    stat: state.activeDetails.stat,
    response: state.activeDetails.response,
    role: state.session.role,
  }));
  const { toggleFocusDetails } = useStoreActions((actions) => ({
    toggleFocusDetails: actions.toggleFocusDetails,
  }));

  const SideDetail = useRef();

  return (
    <SideDetailsWrapper
      onBlur={() => toggleFocusDetails()}
      focus={onFocus}
      tabIndex="0"
      ref={SideDetail}
    >
      <Control>
        <Action onClick={() => SideDetail.current.blur()} title="Tutup Detail">
          <span className="material-icons">logout</span>
        </Action>
        <CustomButton>unduh laporan</CustomButton>
      </Control>
      <Header>
        <img src={pic ? pic : DefaultImg} alt={title} />
        <section>
          <h2>{title}</h2>
          <p>{date + " - " + vis + " - " + stat}</p>
        </section>
      </Header>
      <Body>
        <section>
          <p>{report}</p>
        </section>
        {role === "pengguna" && response ? (
          <section>
            <Label htmlFor="responBalik">respon balik</Label>
            <TextArea readOnly>{response}</TextArea>
          </section>
        ) : null}
        {role === "admin" || role === "petugas" ? (
          <section>
            <Label htmlFor="responBalik">respon balik</Label>
            <TextArea>{response}</TextArea>
            <Button>kirim respon</Button>
          </section>
        ) : null}
      </Body>
    </SideDetailsWrapper>
  );
}
