import Resizer from "react-image-file-resizer";
import md5 from "md5";

const compressIMG = (file, height, width) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      "WEBP",
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
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

export { dimensionIMG, compressIMG, md5Compare };
