import { jsPDF } from "jspdf";

import FullLogo from "asset/FullLogo.png";
import DefaultImg from "asset/defaultReport.jpg";

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

export default async function GeneratesPDF(props) {
  const doc = new jsPDF();
  const {
    title,
    report,
    date_report,
    date_response,
    response,
    name_pengguna,
    name_petugas,
    pic
  } = props;

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
