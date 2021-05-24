// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, isSupported)' will be passed back the detection result (in an asynchronous way!)
async function check_webp_feature(feature) {
  let kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha:
      "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation:
      "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
  };

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      let result = img.width > 0 && img.height > 0;
      resolve(result);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
  });
}

export { check_webp_feature };
