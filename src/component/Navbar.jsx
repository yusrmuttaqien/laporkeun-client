import React from "react";
import styled from "styled-components";

import LogoDesc from "./../asset/LogoDesc.svg";
// import { FormMasuk } from "./Form";
import { Navigation } from "./Navigation";
import UserStats from "./UserStats";

// TODO: Add responsive styling
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
  border-right: 1px solid ${(props) => props.theme.color.white}; // TODO: Add dynamics with redux
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

// TODO: Add responsive content
export default function Navbar() {
  return (
    <NavWrapper>
      <img
        src={LogoDesc}
        alt="Logo with Description"
        draggable="false"
        id="logowDesc"
      />
      {/* <FormMasuk /> */}
      <Navigation />
      <UserStats />
    </NavWrapper>
  );
}
