import Resizer from "react-image-file-resizer";
import md5 from "md5";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

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

  let toCompareCurrent = new Date(currDate).toISOString(),
    toCompareDate = new Date(date).toISOString();

  if (toCompareCurrent < toCompareDate && currUID === uid) {
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

      imgToURL = await getDownloadURL(ref(ref(storage, "/laporan"), imgToURL));
      return imgToURL;
    case "profile":
      if (check_webp_feature("alpha")) {
        imgToURL = obj.webp;
      } else {
        imgToURL = obj.png;
      }

      imgToURL = await getDownloadURL(ref(ref(storage, "/profile"), imgToURL));
      return imgToURL;
    default:
      break;
  }
}

async function imgProcessing(img, mode) {
  let imgDimension, imgWhat, imgWEBP, imgJPEG, imgBase64, imgPNG;
  imgDimension = await dimensionIMG(img);

  switch (mode) {
    case "buatLapor":
      imgWhat =
        imgDimension.width > imgDimension.height
          ? { height: imgDimension.height % 2 === 0 ? 8 : 9 }
          : { width: imgDimension.width % 2 === 0 ? 8 : 9 };

      imgWEBP = await compressIMG({
        file: img,
        ...imgDimension,
      });
      imgJPEG = await compressIMG({
        file: img,
        ...imgDimension,
        format: "JPEG",
      });
      imgBase64 = await compressIMG({
        file: img,
        ...imgWhat,
        quality: 50,
        format: "JPEG",
        output: "base64",
      });
      break;
    case "profile":
      imgWEBP = await compressIMG({
        file: img,
        ...imgDimension,
      });
      imgPNG = await compressIMG({
        file: img,
        ...imgDimension,
        quality: 50,
        format: "PNG",
      });
      break;
    default:
      break;
  }

  return { imgDimension, imgWEBP, imgJPEG, imgBase64, imgPNG };
}

async function uploadMultipleIMG(payload, mode) {
  let storageRef;

  const loopUpload = async (payload) => {
    for (const param in payload) {
      await uploadBytes(
        ref(storageRef, payload[param].name),
        payload[param].file
      ).catch((err) => {
        return 0;
      });
    }
  };

  switch (mode) {
    case "buatLapor":
      storageRef = ref(storage, "/laporan");

      try {
        await loopUpload(payload);
      } catch (err) {
        return 0;
      }
      break;
    case "profile":
      storageRef = ref(storage, "/profile");

      try {
        await loopUpload(payload);
      } catch (err) {
        return 0;
      }
      break;
    default:
      break;
  }

  return 1;
}

async function deleteMultipleIMG(payload, mode) {
  let storageRef;

  const loopDelete = async (payload) => {
    for (const param in payload) {
      await deleteObject(ref(storageRef, payload[param])).catch((err) => {
        return 0;
      });
    }
  };

  switch (mode) {
    case "deleteLapor":
      storageRef = ref(storage, "/laporan");
      try {
        await loopDelete(payload);
      } catch (err) {
        return 0;
      }
      break;
    case "profile":
      storageRef = ref(storage, "/profile");

      try {
        await loopDelete(payload);
      } catch (err) {
        return 0;
      }
      break;
    default:
      break;
  }

  return 1;
}

function getTime() {
  let currTime = new Date().toLocaleString("en-ID", {
    timeZone: "Asia/Jakarta",
    hour12: true,
  });

  return currTime;
}

function getUnixEpooch() {
  let currTime = Date.now();

  return currTime;
}

export {
  dimensionIMG,
  compressIMG,
  md5Compare,
  uidAccDateChecker,
  multiImgURL,
  imgProcessing,
  uploadMultipleIMG,
  deleteMultipleIMG,
  getTime,
  getUnixEpooch,
};
