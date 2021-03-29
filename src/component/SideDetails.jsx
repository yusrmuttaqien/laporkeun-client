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
import { useHistory } from "react-router-dom";
import { jsPDF } from "jspdf";

import DefaultImg from "./../asset/defaultReport.jpg";
import FullLogo from "./../asset/FullLogo.png";
import { useDetails } from "./FetchData";

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

const SchemaTanggapan = yup.object().shape({
  responBalik: yup
    .string()
    .required("Respon wajib diisi")
    .max(2000, "Respon maksimal 2000 karakter"),
});

export default function SideDetails(props) {
  const { role, NIKSession } = useStoreState((state) => ({
    role: state.session.role,
    NIKSession: state.session.NIK,
  }));
  const { newResponse, deleteReport } = useStoreActions((actions) => ({
    newResponse: actions.newResponse,
    deleteReport: actions.deleteReport,
  }));
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaTanggapan),
  });
  const history = useHistory();

  const generatePDF = async () => {
    const doc = new jsPDF();

    function getDataUri(url) {
      return new Promise((resolve) => {
        var image = new Image();
        image.setAttribute("crossorigin", "anonymous"); // CORS stuff

        image.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;

          // Change transp BG to white
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff"; // Fill white
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          canvas.getContext("2d").drawImage(this, 0, 0);

          resolve(canvas.toDataURL("image/jpeg"));
        };

        image.src = url;
      });
    }

    if (pic) {
      var imgUri = await getDataUri(pic);
    }

    var titleText = doc.splitTextToSize(title, 59);
    var reportText = doc.splitTextToSize(report, 120);
    var responseText = doc.splitTextToSize(response, 120);

    doc.addImage(FullLogo, "PNG", 55, 15);

    doc.setFont("courier", "bold");
    doc.text(`Laporan pengguna ${name_pengguna}`, 15, 60);

    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text(
      `${date_report} - ditanggapi oleh ${name_petugas} tgl ${date_response}`,
      15,
      65
    );

    doc.addImage(pic ? imgUri : DefaultImg, "PNG", 15, 70, 95, 50);

    doc.setFontSize(20);
    doc.setFont("courier", "bold");
    doc.text(titleText, 113, 78);

    doc.setFontSize(18);
    doc.setFont("courier", "bold");
    doc.text("Laporan", 15, 135);

    doc.setFontSize(8);
    doc.setFont("courier", "bold");
    doc.text(reportText, 15, 140);

    doc.setFontSize(18);
    doc.setFont("courier", "bold");
    doc.text("Tanggapan", 110, 135);

    doc.setFontSize(8);
    doc.setFont("courier", "bold");
    doc.text(responseText, 110, 140);

    doc.save(`laporkeun! Laporan ${title} oleh ${name_pengguna}.pdf`);
  };

  // const SideDetail = useRef();
  const onSubmit = (response) => {
    const Redirect = () => {
      history.push("/tanggapanku");
    };

    toast.promise(newResponse(response), {
      loading: "Menyimpan respon",
      success: (msg) => {
        props.sd.setToggleSD(!props.sd.toggleSD);
        Redirect();
        return msg;
      },
      error: (err) => err.toString(),
    });
  };

  const onDelete = () => {
    const Redirect = () => {
      history.go(0);
    };

    toast.promise(deleteReport(), {
      loading: "Menghapus laporan",
      success: (msg) => {
        Redirect();
        return msg;
      },
      error: (err) => err.toString(),
    });
  };

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
  } = activeDetails;

  return (
    <SideDetailsWrapper
      // onBlur={() => toggleFocusDetails()}
      focus={props.sd.toggleSD}
      tabIndex="0"
      // ref={SideDetail}
    >
      <Control>
        <Action
          onClick={() => props.sd.setToggleSD(!props.sd.toggleSD)}
          title="Tutup Detail"
        >
          <span className="material-icons">logout</span>
        </Action>
        {role === "admin" && response ? (
          <CustomButton onClick={() => generatePDF()}>
            unduh laporan
          </CustomButton>
        ) : null}
        {role === "pengguna" && stat === "Menunggu" && NIKSession === NIK ? (
          <CustomButton onClick={() => onDelete()}>hapus laporan</CustomButton>
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
