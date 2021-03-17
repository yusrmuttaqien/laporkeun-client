import React from "react";
import styled from "styled-components";

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
    color: ${props => props.theme.color.purple};
    font-weight : ${props => props.theme.value.font.medium};
    letter-spacing: 0.125em;
`

// TODO: Add dynamics with redux
export default function UserStats() {
  return (
    <StatsWrapper>
      <UserDetail>
        <img src={defaultUser} alt="userProfile" />
        <Details>
          <h1 title="Peter Evaneggtg, Pengguna">Peter Evaneggtg</h1>
          <p title="937593839406">937593839406</p>
        </Details>
      </UserDetail>
      <CloseSession title="Keluar ?">Keluar</CloseSession>
    </StatsWrapper>
  );
}
