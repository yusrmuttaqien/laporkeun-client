import styled from "styled-components";

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

const ReportWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  height: inherit;
  min-height: inherit;
`;

const Report = styled.div`
  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  border-radius: ${(props) => props.theme.value.radius}
    ${(props) => props.theme.value.radius} 0 0;
  color: ${(props) => props.theme.color.white};

  height: 95%;
  width: 88%;
  max-width: 1340px;
  padding: 35px 50px 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
    font-weight: ${(props) => props.theme.value.font.medium};
    font-size: 3rem;
    margin-bottom: 0.3em;
  }
`;

const ReportBody = styled.div`
  flex: 1;
  display: inherit;
  flex-direction: column;

  height: 100%;

  overflow: auto;
`;

const Action = styled.div`
  cursor: pointer;
  user-select: none;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  font-weight: ${(props) => props.theme.value.font.medium};
  font-size: 1rem;
  border-radius: ${(props) => props.theme.value.radius};
  outline: none;
  border: none;
  transition: ${(props) => props.theme.value.transition};
  transition-property: background-color, color;
  letter-spacing: 0.125em;

  padding: 0.3em 0.8em;

  &:hover {
    color: ${(props) => props.theme.color.white};
    background-color: ${(props) => props.theme.color.dark};
    cursor: pointer;
  }
`;

const Warning = styled.p`
  &&& {
    color: ${(props) => props.theme.color.blue};
    font-weight: ${(props) => props.theme.value.font.light};
    text-align: left;
    font-size: 0.8rem;
    text-decoration: none;
    cursor: unset;
    user-select: none;
  }
`;

export {
  Label,
  Input,
  TextArea,
  ReportWrapper,
  Report,
  ReportBody,
  Action,
  Button,
  Warning,
};
