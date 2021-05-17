import React from "react";
import styled from "styled-components";

import Image from "util/ImageView";

const Content = styled.div`
  display: flex;

  height: 500px;
  width: 100%;
  
  .imageSection {
  }
`;

export default function DetailsContent() {
  return (
    <Content>
      <div className="imageSection">
        <Image />
      </div>
    </Content>
  );
}
