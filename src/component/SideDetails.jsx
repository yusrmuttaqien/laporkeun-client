//  NOTE: Hardcoded variable
//  NOTE: Disabled feature - onBlur
import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-hot-toast";
// import { useHistory } from "react-router-dom";
import { useState as GlobalState } from "@hookstate/core";

import { useDetails } from "util/CustomHooks";
import { Action, Button, Label, TextArea } from "style/Components";
import { SchemaTanggapan } from "util/ValidationSchema";
import { DataInstance, SDInstance } from "util/States";
import GeneratesPDF from "util/GeneratePDF";

import DefaultImg from "asset/defaultReport.jpg";

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

const ShowResponse = styled.div`
  width: 100%;
  height: 100%;

  border: 1px solid ${(props) => props.theme.color.white};
  color: ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.value.radius};
  opacity: ${(props) => props.theme.value.opacity};
  font-size: 0.85rem;
  transition: ${(props) => props.theme.value.transition};
  transition-property: opacity;

  padding: 0.7em 0.9em;
  margin-bottom: 1em;

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export default function SideDetails() {
  const DataState = GlobalState(DataInstance);
  const SDState = GlobalState(SDInstance);
  const { role, NIK: NIKSession } = DataState.session.get();
  const sideDetailsStat = SDState.stats.get();

  const sideDetailsStatToggle = () => {
    // state.sideDetails.set((prev) => !prev);
  };

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaTanggapan),
  });

  // const history = useHistory();

  const { activeDetails } = useDetails();
  const {
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
    NIK,
    loc,
  } = activeDetails;

  const generate = () => {
    const payload = {
      pic,
      title,
      report,
      date_report,
      date_response,
      response,
      name_pengguna,
      name_petugas,
    };
    // Use toast
    GeneratesPDF(payload);
  };

  const onSubmit = (response) => {
    // const Redirect = () => {
    //   history.push("/tanggapanku");
    // };

    // func response
    // toast.promise(, {
    //   loading: "Menyimpan respon",
    //   success: (msg) => {
    //     props.sd.setToggleSD(!props.sd.toggleSD);
    //     Redirect();
    //     return msg;
    //   },
    //   error: (err) => err.toString(),
    // });
  };

  const onDelete = () => {
    // const Redirect = () => {
    //   history.go(0);
    // };

    //  func del report
    // toast.promise(, {
    //   loading: "Menghapus laporan",
    //   success: (msg) => {
    //     Redirect();
    //     return msg;
    //   },
    //   error: (err) => err.toString(),
    // });
  };

  return (
    <SideDetailsWrapper focus={sideDetailsStat} tabIndex="0">
      <Control>
        <Action onClick={sideDetailsStatToggle} title="Tutup Detail">
          <span className="material-icons">logout</span>
        </Action>
        {role === "admin" && response ? (
          <CustomButton onClick={generate}>unduh laporan</CustomButton>
        ) : null}
        {role === "pengguna" && stat === "Menunggu" && NIKSession === NIK ? (
          <CustomButton onClick={onDelete}>hapus laporan</CustomButton>
        ) : null}
      </Control>
      <Header>
        <img src={pic ? pic : DefaultImg} alt={title} />
        <section>
          <h2 title={title}>{title}</h2>
          <p
            title={
              name_pengguna +
              " - " +
              date_report +
              " - " +
              loc +
              " - " +
              vis +
              " - " +
              stat
            }
          >
            {name_pengguna +
              " - " +
              date_report +
              " - " +
              loc +
              " - " +
              vis +
              " - " +
              stat}
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
                htmlFor="responBalikPreview"
                title={`${date_response && date_response} ${
                  name_petugas && " - " + name_petugas
                }`}
              >
                respon balik {date_response && " - " + date_response}{" "}
                {name_petugas && " - " + name_petugas}
              </Label>
              <ShowResponse id="responBalikPreview" name="responBalikPreview">
                {response}
              </ShowResponse>
            </EmbedForm>
          </section>
        ) : null}
        {role === "admin" || role === "petugas" ? (
          <section>
            {response ? (
              <EmbedForm>
                <Label
                  htmlFor="responBalikPreview"
                  title={`${date_response && date_response} ${
                    name_petugas && " - " + name_petugas
                  }`}
                >
                  respon balik {date_response && " - " + date_response}{" "}
                  {name_petugas && " - " + name_petugas}
                </Label>
                <ShowResponse id="responBalikPreview" name="responBalikPreview">
                  {response}
                </ShowResponse>
              </EmbedForm>
            ) : (
              <EmbedForm noValidate onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor="responBalik">respon balik</Label>
                <TextArea
                  name="responBalik"
                  id="responBalik"
                  ref={register}
                ></TextArea>
                <Button type="submit">
                  {errors.responBalik?.message
                    ? errors.responBalik?.message
                    : "Kirim respon"}
                </Button>
              </EmbedForm>
            )}
          </section>
        ) : null}
      </Body>
    </SideDetailsWrapper>
  );
}
