// NOTE: Hardcoded variable
import React from "react";
import styled from "styled-components";

import LogoDesc from "./../asset/LogoDesc.svg";
import { FormMasuk, FormDaftar } from "./Form";
import { Navigation } from "./Navigation";
import UserStats from "./UserStats";
import { useStoreState, useStoreActions } from "easy-peasy";

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

export default function Navbar() {
  const { formDefault, isLogged } = useStoreState((state) => ({
    formDefault: state.UI.formDefault,
    isLogged: state.session.isLogged,
  }));
  const { toggleFormDefault } = useStoreActions((actions) => ({
    toggleFormDefault: actions.toggleFormDefault,
  }));

  return (
    <NavWrapper isLogged={isLogged}>
      <img
        src={LogoDesc}
        alt="Logo with Description"
        draggable="false"
        id="logowDesc"
        title="laporkeun! by yusr.dhm"
      />
      {isLogged ? (
        <>
          <Navigation />
          <UserStats />
        </>
      ) : formDefault === "Masuk" ? (
        <FormMasuk toggleFormDefault={toggleFormDefault} />
      ) : (
        <FormDaftar toggleFormDefault={toggleFormDefault} />
      )}
    </NavWrapper>
  );
}
