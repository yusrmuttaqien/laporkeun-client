import styled from "styled-components";

const DIMENSIONAL = "23px";

const Svg = styled.svg`
  fill: ${(props) => props.theme.color.dark};
  transition: ${(props) => props.theme.value.transition};
  transition-property: fill;

  &.inButton {
    &:hover {
      fill: ${(props) => props.theme.color.white};
    }
  }
`;

function Trashbin(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
    </Svg>
  );
}

function Reload(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M.01 0h24v24h-24V0z" fill="none" />
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </Svg>
  );
}

function Lock(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <g fill="none">
        <path d="M0 0h24v24H0V0z" />
        <path d="M0 0h24v24H0V0z" opacity=".87" />
      </g>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </Svg>
  );
}

function UnLock(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </Svg>
  );
}

export { Trashbin, Reload, Lock, UnLock };
