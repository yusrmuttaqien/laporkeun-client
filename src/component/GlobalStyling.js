import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const Theme = {
  color: {
    white: "#E3E3E3",
    dark: "#070602",
    blue: "#357083",
    darkTransparent: "rgba(7, 6, 2, 0.85)",
    whiteTransparent: "rgba(227, 227, 227, 0.85)",
    grey: "#868686",
    purple: "#852366",
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
    },
    transition: ".3s ease-in-out",
  },
};

const GlobalStyle = createGlobalStyle`
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Jost', sans-serif;
      outline: none;
      -webkit-tap-highlight-color: transparent;
  }
`;

const Label = styled.label`
  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.light};

  margin-bottom: 0.5em;
`;

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.color.white};
  background-color: transparent;
  color: ${(props) => props.theme.color.white};
  outline: none;
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  padding: 0.7em 0.9em;
  margin-bottom: 1em;

  &:hover,
  &:focus {
    opacity: 1;
  }

  &::-ms-reveal,
  &::-ms-clear {
    filter: invert(100%);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;

  resize: none;
  border: 1px solid ${(props) => props.theme.color.white};
  background-color: transparent;
  color: ${(props) => props.theme.color.white};
  outline: none;
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  padding: 0.7em 0.9em;
  margin-bottom: 1em;

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export { GlobalStyle, Theme, Label, Input, TextArea };
