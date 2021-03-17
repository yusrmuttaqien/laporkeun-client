import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavWrapper = styled.div`
  /* background-color: green; */
  align-self: flex-end;

  height: 50%;
  width: 83%;

  ul {
    list-style-type: none;

    li {
      margin-bottom: 0.3em;

      &:last-child {
        margin-bottom: 0;
      }

      a {
        color: ${(props) => props.theme.color.white};
        text-decoration: none;
        font-weight: ${(props) => props.theme.value.font.medium};
        text-align: center;
        transition: ${(props) => props.theme.value.transition};
        transition-property: background-color, color;
        letter-spacing: 0.125em;

        width: 100%;
        padding: 0.12em 0;

        display: block;

        &:hover {
          color: ${(props) => props.theme.color.dark};
          background-color: ${(props) => props.theme.color.whiteTransparent};
        }

        &.active {
          color: ${(props) => props.theme.color.dark};
          background-color: ${(props) => props.theme.color.white};
        }
      }
    }
  }
`;

// TODO: Add dynamics with redux
function Navigation() {
  return (
    <NavWrapper>
      <ul>
        <li>
          <NavLink exact to="/buatlaporan" activeClassName="active">
            buat laporan
          </NavLink>
        </li>
        <li>
          <NavLink to="/laporanku" activeClassName="active">
            laporanku
          </NavLink>
        </li>
        <li>
          <NavLink to="/laporanpublik" activeClassName="active">
            laporan publik
          </NavLink>
        </li>
        <li>
          <NavLink to="/laporanbaru" activeClassName="active">
            laporan baru
          </NavLink>
        </li>
        <li>
          <NavLink to="/tanggapanku" activeClassName="active">
            tanggapanku
          </NavLink>
        </li>
        <li>
          <NavLink to="/petugas" activeClassName="active">
            petugas
          </NavLink>
        </li>
      </ul>
    </NavWrapper>
  );
}

export { Navigation };
