import React from "react";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { toast } from "react-hot-toast";

import defaultUser from "./../asset/defaultUser.svg";

const StatsWrapper = styled.div`
  /* background-color: blue; */

  height: 20%;
  width: 83%;

  display: inherit;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const UserDetail = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  margin-bottom: 1em;

  img {
    width: 3.5rem;
    margin-right: 0.6em;
  }
`;

const Details = styled.div`
  letter-spacing: 0.125em;
  color: ${(props) => props.theme.color.white};
  /* background-color: green; */

  width: 45%;
  overflow: hidden;

  display: inherit;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h1,
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  h1 {
    font-size: 1rem;
    font-weight: ${(props) => props.theme.value.font.medium};
  }

  p {
    font-size: 0.8rem;
    font-weight: ${(props) => props.theme.value.font.light};
  }
`;

const CloseSession = styled.p`
  cursor: pointer;
  color: ${(props) => props.theme.color.purple};
  font-weight: ${(props) => props.theme.value.font.medium};
  letter-spacing: 0.125em;
`;

export default function UserStats() {
  const { role, name, NIK, pic } = useStoreState((state) => ({
    role: state.session.role,
    name: state.session.name,
    NIK: state.session.NIK,
    pic: state.session.pic,
  }));
  const { keluarApp } = useStoreActions((actions) => ({
    keluarApp: actions.keluarApp,
  }));

  const exitApp = async () => {
    await keluarApp();
    toast.success('Anda berhasil keluar')
  };

  return (
    <StatsWrapper>
      <UserDetail>
        <img src={pic ? pic : defaultUser} alt="userProfile" />
        <Details>
          <h1
            title={`${name}${
              role && ", " + role.charAt(0).toUpperCase() + role.slice(1)
            }`}
          >
            {name}
          </h1>
          <p title={NIK}>{NIK}</p>
        </Details>
      </UserDetail>
      <CloseSession onClick={() => exitApp()} title="Keluar ?">
        Keluar
      </CloseSession>
    </StatsWrapper>
  );
}
