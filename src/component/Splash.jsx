import React from "react";
import styled from "styled-components";

import rfs from "rfsjs";
import Opps from "./../asset/Opps.svg";

// TODO: Fix for mobile devices
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: inherit;
  min-height: inherit;

  img {
    ${rfs("60%", "width")}
    min-width: 420px;
  }
`;

const Text = styled.h1`
  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.medium};
  ${rfs("3rem", "font-size")}

  span {
    font-style: italic;
  }
`;

function Splash() {
  return (
    <Wrapper>
      <Text>
        Sesuatu meresahkan anda?
        <br />
        <span>laporkeun!</span> kepada kami.
        <br />
        Kami mendengarkan.
      </Text>
    </Wrapper>
  );
}

function NotFound() {
  return (
    <Wrapper>
      <img src={Opps} alt="Not found :(" draggable={false} />
    </Wrapper>
  );
}

function SusLoading() {
  return (
    <Wrapper>
      <Text>Memuat halaman</Text>
    </Wrapper>
  );
}

export { Splash, NotFound, SusLoading };
