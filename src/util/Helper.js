import Resizer from "react-image-file-resizer";
import md5 from "md5";

import { GlobalStateSession } from "util/States";

const compressIMG = ({
  file,
  height,
  width,
  format = "WEBP",
  output = "file",
}) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      format,
      50,
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
  var hash;

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

export { dimensionIMG, compressIMG, md5Compare, uidAccDateChecker };
