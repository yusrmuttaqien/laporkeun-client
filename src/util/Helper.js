import Resizer from "react-image-file-resizer";
import md5 from "md5";

import { GlobalStateSession } from "util/States";
import { storage } from "util/Firebase";
import { check_webp_feature } from "util/WebPCheck";

const compressIMG = ({
  file,
  height,
  width,
  format = "WEBP",
  output = "file",
  quality = 50,
}) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      format,
      quality,
      0,
      (uri) => {
        resolve(uri);
      },
      output,
      width,
      height
    );
  });

function dimensionIMG(img) {
  return new Promise((resolve) => {
    const reader = new Image();
    reader.onload = async () => {
      resolve({ height: reader.height, width: reader.width });
    };
    reader.src = window.URL.createObjectURL(img);
  });
}

async function md5Compare(data, mode = "registered") {
  let hash;

  if (mode === "registered") {
    hash = data + process.env.REACT_APP_HOT_KEY;
    hash = await md5(hash);
  }

  if (mode === "users") {
    hash = data + process.env.REACT_APP_SIGNATURE;
    hash = await md5(hash);
  }

  return hash;
}

function uidAccDateChecker(date, uid) {
  const currDate = GlobalStateSession().getDate();
  const currUID = GlobalStateSession().getUIDUser();

  if (currDate < date && currUID === uid) {
    return true;
  }

  return false;
}

async function multiImgURL(obj, mode) {
  let imgToURL;
  switch (mode) {
    case "laporan":
      if (check_webp_feature("lossy")) {
        imgToURL = obj.webp;
      } else {
        imgToURL = obj.jpeg;
      }

      imgToURL = await storage.ref("/laporan").child(imgToURL).getDownloadURL();
      return imgToURL;
    default:
      break;
  }
}

export {
  dimensionIMG,
  compressIMG,
  md5Compare,
  uidAccDateChecker,
  multiImgURL,
};
