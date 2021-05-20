import React from "react";
import styled from "styled-components";

const ImageWrapper = styled.picture`
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export default function ImageView(props) {
  const { thumbnail, height, width, img } = props;

  return (
    <ImageWrapper>
      <img src={thumbnail} alt="imgView" />
    </ImageWrapper>
  );
}
