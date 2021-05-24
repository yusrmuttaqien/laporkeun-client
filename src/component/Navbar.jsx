import React from "react";
import { useState as GlobalState } from "@hookstate/core";
import styled from "styled-components";

import Entry from "./Entry";
import Navigation from "./Navigation";
import { DataInstance } from "util/States";
import UserStats from "./UserStats";

import LogoDesc from "asset/LogoDesc.svg";
import About from "asset/about.svg";

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: inherit;
  min-height: inherit;
  width: ${(props) => props.theme.value.UI.navbarDesktop};
  padding: 30px 0px;
  position: absolute;
  z-index: 1000;

  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  border-right: ${(props) =>
    props.isLogged ? `1px solid ${props.theme.color.white}` : "none"};
  transition: ${(props) => props.theme.value.transition};
  transition-property: transform;

  @media only screen and (max-width: 858px) {
    transform: translateX(
      calc(
        ${(props) => props.theme.value.UI.navbarDesktopSmall} -
          ${(props) => props.theme.value.UI.navbarDesktop}
      )
    );

    &:hover {
      transform: translateX(0px);
    }
  }
`;

const LogoContainer = styled.div`
  height: 87px;
  width: 100%;

  position: relative;

  text-align: center;

  section {
    transition: ${(props) => props.theme.value.transition};
    transition-property: opacity;

    &:nth-child(1) {
      opacity: 1;
    }

    &:nth-child(2) {
      opacity: 0;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover {
    section {
      &:nth-child(1) {
        opacity: 0;
      }

      &:nth-child(2) {
        opacity: 1;
      }
    }
  }
`;

export default function Navbar(props) {
  const state = GlobalState(DataInstance);
  const { isLogged } = state.session.get();

  return (
    <NavWrapper isLogged={isLogged}>
      <LogoContainer>
        <section>
          <img
            src={LogoDesc}
            alt="Logo with Description"
            draggable="false"
            id="logowDesc"
            title="laporkeun! by yusr.dhm"
          />
        </section>
        <section>
          <img
            src={About}
            alt="Logo with Credit"
            draggable="false"
            id="logowDesc"
            title="laporkeun! by yusr.dhm"
          />
        </section>
      </LogoContainer>
      {isLogged ? (
        <>
          <Navigation />
          <UserStats />
        </>
      ) : (
        <Entry />
      )}
    </NavWrapper>
  );
}
