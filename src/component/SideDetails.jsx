//  NOTE: Hardcoded variable
//  NOTE: Disabled feature - onBlur
import React from "react";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Action, Button, Label, TextArea } from "./GlobalStyling";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import DefaultImg from "./../asset/defaultReport.jpg";
import { useHistory } from "react-router-dom";

const SideDetailsWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1001;
  transform: ${(props) =>
    props.focus ? "translateX(0%)" : "translateX(100%)"};

  height: inherit;
  min-height: inherit;
  width: ${(props) => props.theme.value.UI.sideDetails};
  padding: 20px 30px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  transition: ${(props) => props.theme.value.transition};
  color: ${(props) => props.theme.color.white};
`;

const Control = styled.div`
  display: flex;
  justify-content: space-between;

  height: fit-content;
`;

const Header = styled.div`
  height: 30%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    align-self: center;

    height: 70%;
    max-width: 100%;

    object-fit: contain;
    border-radius: ${(props) => props.theme.value.radius};
  }

  section {
    margin-top: 0.3em;

    h2,
    p {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    h2 {
      font-weight: ${(props) => props.theme.value.font.normal};
    }

    p {
      font-weight: ${(props) => props.theme.value.font.light};
      font-size: 0.8rem;
    }
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 60%;

  section {
    &:nth-child(1) {
      flex: 1;

      overflow: auto;

      margin-bottom: 0.5em;
      padding-right: 5px;

      p {
        font-weight: ${(props) => props.theme.value.font.light};
        text-align: justify;

        height: inherit;
      }
    }

    &:nth-child(2) {
      height: 55%;
      margin-top: 0.3em;

      ${Label} {
        font-weight: ${(props) => props.theme.value.font.normal};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        width: 100%;
        height: 2.3em;
      }
    }
  }
`;

const CustomButton = styled(Button)`
  font-size: 0.85rem;
`;

const EmbedForm = styled.form`
  display: flex;
  flex-direction: column;

  height: 100%;
`;

const SchemaTanggapan = yup.object().shape({
  responBalik: yup
    .string()
    .required("Respon wajib diisi")
    .max(2000, "Respon maksimal 2000 karakter"),
});

export default function SideDetails(props) {
  const {
    onFocus,
    pic,
    title,
    report,
    date_report,
    date_response,
    vis,
    stat,
    response,
    name_pengguna,
    name_petugas,
    role,
  } = useStoreState((state) => ({
    onFocus: state.UI.sideDetails.onFocus,
    pic: state.activeDetail.pic,
    title: state.activeDetail.title,
    report: state.activeDetail.report,
    date_report: state.activeDetail.date_report,
    date_response: state.activeDetail.date_response,
    vis: state.activeDetail.vis,
    stat: state.activeDetail.stat,
    response: state.activeDetail.response,
    name_pengguna: state.activeDetail.name_pengguna,
    name_petugas: state.activeDetail.name_petugas,
    role: state.session.role,
  }));
  const { toggleFocusDetails, newResponse } = useStoreActions((actions) => ({
    toggleFocusDetails: actions.toggleFocusDetails,
    newResponse: actions.newResponse,
  }));
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaTanggapan),
  });
  const history = useHistory();

  // const SideDetail = useRef();
  const onSubmit = (response) => {
    const Redirect = () => {
      history.push("/tanggapanku");
    };

    toast.promise(newResponse(response), {
      loading: "Menyimpan respon",
      success: (msg) => {
        Redirect();
        return msg;
      },
      error: (err) => err.toString(),
    });
  };

  return (
    <SideDetailsWrapper
      // onBlur={() => toggleFocusDetails()}
      focus={onFocus}
      tabIndex="0"
      // ref={SideDetail}
    >
      <Control>
        <Action onClick={() => toggleFocusDetails()} title="Tutup Detail">
          <span className="material-icons">logout</span>
        </Action>
        {role === "admin" && <CustomButton>unduh laporan</CustomButton>}
        {role === "pengguna" && stat === "Menunggu" ? (
          <CustomButton>hapus laporan</CustomButton>
        ) : null}
      </Control>
      <Header>
        <img src={pic ? pic : DefaultImg} alt={title} />
        <section>
          <h2 title={title}>{title}</h2>
          <p
            title={
              name_pengguna + " - " + date_report + " - " + vis + " - " + stat
            }
          >
            {name_pengguna + " - " + date_report + " - " + vis + " - " + stat}
          </p>
        </section>
      </Header>
      <Body>
        <section>
          <p>{report}</p>
        </section>
        {role === "pengguna" && response ? (
          <section>
            <EmbedForm>
              <Label
                htmlFor="responBalik"
                title={`${date_response && date_response} ${
                  name_petugas && " - " + name_petugas
                }`}
              >
                respon balik {date_response && " - " + date_response}{" "}
                {name_petugas && " - " + name_petugas}
              </Label>
              <TextArea
                name="responBalik"
                id="responBalik"
                readOnly
                value={response}
              ></TextArea>
            </EmbedForm>
          </section>
        ) : null}
        {role === "admin" || role === "petugas" ? (
          <section>
            <EmbedForm noValidate onSubmit={handleSubmit(onSubmit)}>
              <Label
                htmlFor="responBalik"
                title={`${date_response && date_response} ${
                  name_petugas && " - " + name_petugas
                }`}
              >
                respon balik {date_response && " - " + date_response}{" "}
                {name_petugas && " - " + name_petugas}
              </Label>
              {response ? (
                <TextArea
                  name="responBalik"
                  id="responBalik"
                  readOnly
                  value={response && response}
                  ref={register}
                ></TextArea>
              ) : (
                <TextArea
                  name="responBalik"
                  id="responBalik"
                  defaultValue={response && response}
                  ref={register}
                ></TextArea>
              )}
              {response ? null : (
                // NOTE: Disabled features - Simultanious Changes
                <Button type="submit">
                  {errors.responBalik?.message
                    ? errors.responBalik?.message
                    : "Kirim respon"}
                </Button>
              )}
            </EmbedForm>
          </section>
        ) : null}
      </Body>
    </SideDetailsWrapper>
  );
}
