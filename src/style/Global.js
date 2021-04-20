import { createGlobalStyle, css } from "styled-components";

const Variables = {
  color: {
    white: "#E3E3E3",
    dark: "#070602",
    blue: "#357083",
    darkTransparent: "rgba(7, 6, 2, 0.80)",
    whiteTransparent: "rgba(227, 227, 227, 0.85)",
    grey: "#868686",
    purple: "#852366",
    waiting: "#e63b3b",
    done: "#3be691",
  },
  value: {
    blur: "15px",
    radius: "5px",
    opacity: 0.5,
    font: {
      light: 300,
      normal: 400,
      medium: 500,
    },
    UI: {
      navbarDesktop: "300px",
      navbarDesktopSmall: "200px",
      sideDetails: "400px",
    },
    transition: ".3s ease-in-out",
  },
};

const GlobalStyle = createGlobalStyle`${css`
  body {
    background-color: ${Variables.color.dark};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Jost", sans-serif;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .toast {
    background-color: ${Variables.color.darkTransparent};
    backdrop-filter: blur(${Variables.value.blur});
    color: ${Variables.color.white};
  }

  ::-moz-selection {
    /* Code for Firefox */
    color: ${Variables.color.white} !important;
    background: ${Variables.color.purple} !important;
  }

  ::selection {
    color: ${Variables.color.white} !important;
    background: ${Variables.color.purple} !important;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${Variables.color.grey};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${Variables.color.purple};
  }

  ::-webkit-scrollbar-track {
    background: ${Variables.color.darkTransparent};
  }
`}`;

export {
  GlobalStyle,
  Variables,
};
