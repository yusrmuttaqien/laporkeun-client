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

  &.inAction {
    fill: ${(props) => props.theme.color.white};
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

function Public(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z" />
    </Svg>
  );
}

function NoPublic(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <g>
        <rect fill="none" height="24" width="24" />
        <path d="M11,8.17L6.49,3.66C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-1.46-1.46 C19.59,14.87,20,13.48,20,12c0-3.35-2.07-6.22-5-7.41V5c0,1.1-0.9,2-2,2h-2V8.17z M21.19,21.19l-1.41,1.41l-2.27-2.27 C15.93,21.39,14.04,22,12,22C6.48,22,2,17.52,2,12c0-2.04,0.61-3.93,1.66-5.51L1.39,4.22l1.41-1.41L21.19,21.19z M11,18 c-1.1,0-2-0.9-2-2v-1l-4.79-4.79C4.08,10.79,4,11.38,4,12c0,4.08,3.05,7.44,7,7.93V18z" />
      </g>
    </Svg>
  );
}

function Info(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </Svg>
  );
}

function Exit(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height={DIMENSIONAL}
      viewBox="0 0 24 24"
      width={DIMENSIONAL}
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </Svg>
  );
}

export { Trashbin, Reload, Lock, UnLock, Public, NoPublic, Info, Exit };
