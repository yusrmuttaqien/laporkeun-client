// NOTE: Hardcoded variable
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useStoreActions, useStoreState } from "easy-peasy";
import toast from "react-hot-toast";

const NavWrapper = styled.div`
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

function Navigation() {
  const { role } = useStoreState((state) => ({
    role: state.session.role,
  }));

  const test = useStoreActions((actions) => actions.toggleFocusDetails);

  const runTest = () => {
    test();
    toast("Cheking");
  };

  return (
    <NavWrapper>
      <ul>
        {role === "pengguna" && (
          <>
            <li>
              <NavLink to="/buatlaporan" activeClassName="active">
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
          </>
        )}
        {role === "petugas" || role === "admin" ? (
          <>
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
          </>
        ) : null}
        {role === "admin" && (
          <li>
            <NavLink to="/petugas" activeClassName="active">
              petugas
            </NavLink>
          </li>
        )}
        <li>
          {/* eslint-disable-next-line */}
          <a href="#" onClick={() => runTest()}>
            Run Test
          </a>
        </li>
      </ul>
    </NavWrapper>
  );
}

export { Navigation };
