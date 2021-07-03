import React, { useRef, useState } from "react";
import styled from "styled-components";
import { InView } from "react-intersection-observer";

const ImageWrapper = styled.div`
  position: relative;
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};

  &.forUserStats {
    margin-right: 0.6em;

    img {
      border-radius: 50%;
    }
  }

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

export default function ImageView({
  thumbnail,
  height,
  width,
  img,
  className,
}) {
  const [loading, setLoading] = useState(false);

  const view = useRef();

  const callback = (inView, entry) => {
    if (inView) {
      let downloadingImage = new Image();
      downloadingImage.onload = async () => {
        downloadingImage.alt = "imgView";
        view.current.appendChild(downloadingImage);
        setLoading(true);
      };
      downloadingImage.src = img;
    }
  };

  return (
    <ImageWrapper
      height={height}
      width={width}
      visible={loading}
      ref={view}
      className={className}
    >
      <InView onChange={callback} triggerOnce={true} />
      <img src={thumbnail} alt="imgThumb" className="imgThumb" />
    </ImageWrapper>
  );
}
