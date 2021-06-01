import styled from "styled-components";
import Select from "react-select";

const Label = styled.label`
  margin-bottom: 0.5em;

  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.light};

  &.forButton {
    color: unset;
    font-weight: ${(props) => props.theme.value.font.medium};
    font-size: 1rem;
    appearance: none;
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 0.7em 0.9em;
  margin-bottom: 0.3em;

  border: 1px solid ${(props) => props.theme.color.white};
  background-color: transparent;
  color: ${(props) => props.theme.color.white};
  outline: none;
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

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

  &[type="file"] {
    display: none;
  }

  &.forFile {
    appearance: none;
    display: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.7em 0.9em;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 95%;
  width: 88%;
  max-width: 1340px;
  padding: 35px 50px 0;

  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  border-radius: ${(props) => props.theme.value.radius}
    ${(props) => props.theme.value.radius} 0 0;
  color: ${(props) => props.theme.color.white};

  .reportHeader {
    display: inherit;
    align-items: center;
    justify-content: space-between;

    .multiOption {
      display: inherit;
      align-items: center;

      button:not(:first-child) {
        margin-left: 0.5em;
      }
    }

    h1 {
      margin-bottom: 0.3em;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: ${(props) => props.theme.value.font.medium};
      font-size: 3rem;
    }
  }
`;

const ReportBody = styled.div`
  display: inherit;
  flex-direction: column;
  flex: 1;

  height: 100%;

  overflow: auto;

  &.forSettings {
    flex-direction: row;

    section {
      display: inherit;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &:nth-child(1) {
        width: 60%;

        img {
          width: 50%;
          margin-bottom: 2em;
          border-radius: 50%;
        }
      }

      &:nth-child(2) {
        flex: 1;
      }
    }
  }

  &.forPetugasRegis {
    justify-content: center;
  }

  &.forDataList {
    padding: 0 0.5em;
  }

  &.forBuatLapor {
    padding-bottom: 1em;

    > div {
      display: flex;

      &:nth-child(2) {
        flex: 1;

        margin-top: 0.7em;
      }

      section {
        display: inherit;
        flex-direction: column;
        flex: 1;

        &:not(:nth-child(1)) {
          margin-left: 0.5em;
        }

        &.forBuatLaporType {
          &:nth-child(2) {
            flex: unset;

            width: 23%;
          }
        }

        &.forBuatLaporVis {
          flex: unset;
          align-items: center;
          justify-content: flex-end;

          width: 4em;
        }

        .forBuatLaporNest {
          display: inherit;
          flex-direction: row;
        }
      }
    }
  }
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
  user-select: none;
`;

const Button = styled.button`
  padding: 0.3em 0.8em;

  font-weight: ${(props) => props.theme.value.font.medium};
  font-size: 1rem;
  border-radius: ${(props) => props.theme.value.radius};
  outline: none;
  border: none;
  transition: ${(props) => props.theme.value.transition};
  transition-property: background-color, color;
  letter-spacing: 0.125em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:focus {
    background-color: ${(props) => props.theme.color.purple};
    color: ${(props) => props.theme.color.white};
  }

  &:hover {
    color: ${(props) => props.theme.color.white};
    background-color: ${(props) => props.theme.color.dark};
    cursor: pointer;

    svg {
      fill: ${(props) => props.theme.color.white};
    }
  }

  &.forPopup {
    &:nth-child(2) {
      margin-left: 1em;
    }
  }

  &.forIcon {
    display: flex;

    padding: 0.3em 0.4em;
  }

  &.forEntry {
    margin: 0.5em 0;
  }

  &.normalizeForButton {
    display: flex;
  }

  &.forBuatLaporPreview {
    position: absolute;
    padding: 0.3em 0.4em;
    top: 0.5em;
    right: 0.5em;
  }
`;

const Warning = styled.p`
  &&& {
    margin-bottom: 0.5em;

    color: ${(props) => props.theme.color.blue};
    font-weight: ${(props) => props.theme.value.font.light};
    text-align: left;
    font-size: 0.8rem;
    text-decoration: none;
    cursor: unset;
    user-select: none;
  }
`;

const CustomSelect = styled(Select)`
  width: 200px;

  z-index: 10;
  background-color: transparent;
  outline: none;

  .Select__control {
    background-color: transparent;
    border-color: ${(props) => props.theme.color.grey};
    box-shadow: none;

    .Select__value-container--has-value {
      .Select__single-value {
        color: ${(props) => props.theme.color.grey};
      }

      .Select__input {
        color: ${(props) => props.theme.color.white};
      }
    }

    &:hover {
      border-color: ${(props) => props.theme.color.purple};
    }
  }

  .Select__menu {
    background-color: ${(props) => props.theme.color.darkTransparent};
    backdrop-filter: blur(${(props) => props.theme.value.blur});
  }

  .Select__option {
    &.Select__option--is-selected {
      background-color: ${(props) => props.theme.color.purple};

      &.Select__option--is-focused {
        background-color: ${(props) => props.theme.color.purple};
      }
    }

    &.Select__option--is-focused {
      background-color: ${(props) => props.theme.color.grey};
    }
  }

  @media only screen and (max-width: 950px) {
    width: 140px;
  }

  &.forBuatLapor {
    width: unset;
    margin-bottom: 0.2em;

    .Select__control {
      padding: 0.07em 0;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  &.forSettings {
    width: 60%;
  }

  &.forPopup {
    align-items: center;
    justify-content: center;

    margin-top: 1em;
  }

  &.forPetugasRegis {
    align-self: center;

    width: 60%;
  }

  &.forEntry {
    p {
      color: ${(props) => props.theme.color.white};
      font-weight: ${(props) => props.theme.value.font.light};
      text-align: center;
      font-size: 0.8rem;
      text-decoration: underline;
      cursor: pointer;
      user-select: none;
    }
  }
`;

const DataList = styled.div`
  display: flex;
  justify-content: space-around;

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  ${Action} {
    width: 50px;
  }

  section {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    text-align: center;
  }

  @media only screen and (max-width: 950px) {
    section {
      &:nth-child(2) {
        display: none;
      }
    }
  }

  &.forHeading {
    background-color: ${(props) => props.theme.color.purple};
    font-weight: ${(props) => props.theme.value.font.medium};
    color: ${(props) => props.theme.color.white};

    position: sticky;
    top: 0;
    left: 0;

    cursor: default;
    z-index: 2;

    ${Action} {
      cursor: default;
    }
  }

  &.forBody {
    position: relative;

    background-color: ${(props) => props.theme.color.white};
    color: ${(props) => props.theme.color.dark};
    z-index: 1;

    &.forData {
      &::before {
        width: 3px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        content: "";
        background-color: ${(props) => {
          switch (props.stats) {
            case "Diterima":
            case "notSuspended":
              return props.theme.color.done;
            case "Ditolak":
            case "Suspended":
              return props.theme.color.reject;
            case "Menunggu":
              return props.theme.color.wait;
            default:
              return props.theme.color.process;
          }
        }};
      }
    }
  }
`;

const Notify = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;

    content: "${(props) => props.message}";
    transform: translate(-50%, -50%);
    text-align: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: ${(props) => props.theme.color.darkTransparent};
  z-index: ${(props) => props.index};
  opacity: 0.5;
`;

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  position: relative;

  &.forBuatLapor {
    border: 1px solid ${(props) => props.theme.color.white};
    border-radius: ${(props) => props.theme.value.radius};
    opacity: ${(props) => props.theme.value.opacity};
    transition: ${(props) => props.theme.value.transition};
    transition-property: opacity;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }

  &.forPengaturan {
    .text {
      margin-bottom: 1em;
    }
  }

  img {
    width: 90%;
    max-height: 295px;
    object-fit: contain;
    margin-bottom: 0.5em;
  }
`;

export {
  Label,
  Input,
  TextArea,
  Form,
  ReportWrapper,
  Report,
  ReportBody,
  Action,
  Button,
  Warning,
  CustomSelect,
  DataList,
  Notify,
  Overlay,
  Preview,
};
