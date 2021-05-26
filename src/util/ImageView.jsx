import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ImageWrapper = styled.div`
  position: relative;
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;

    &.imgThumb {
      position: absolute;
      top: 0;
      left: 0;

      image-rendering: pixelated;
      opacity: ${(props) => (props.visible ? 0 : 1)};
      transition: ${(props) => props.theme.value.transition};
      transition-property: opacity;
    }
  }
`;

export default function ImageView({ thumbnail, height, width, img }) {
  const [loading, setLoading] = useState(false);

  const view = useRef();

  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let downloadingImage = new Image();
          downloadingImage.onload = async () => {
            downloadingImage.alt = "imgView";
            view.current.appendChild(downloadingImage);
            setLoading(true);
          };
          downloadingImage.src = img;
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      threshold: 1.0,
    });
    observer.observe(view.current);

    return () => observer.disconnect();
  }, [img]);

  return (
    <ImageWrapper height={height} width={width} ref={view} visible={loading}>
      <img src={thumbnail} alt="imgThumb" className="imgThumb" />
    </ImageWrapper>
  );
}
