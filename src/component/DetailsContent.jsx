import React from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import Image from "util/ImageView";
import Response from "component/DetailsResponse";
import { Label, TextArea, Notify } from "style/Components";
import { DInstance } from "util/States";
import { DetailsPlaceholder } from "style/Images";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  width: 100%;

  > div {
    margin-top: 1em;
  }

  .first {
    display: inherit;
    flex-direction: row;

    .imageSection {
      height: 170px;
      flex: 1;
    }

    .metaSection {
      display: inherit;
      flex-direction: column;
      justify-content: flex-end;
      flex: 1;

      margin-left: 1em;
    }
  }

  .second {
    display: inherit;
    flex-direction: row;
    flex: 1;

    .dSection {
      display: inherit;
      flex-direction: column;
      flex: 1;
    }

    .resSection {
      display: inherit;
      flex-direction: column;
      flex: 1;

      margin-left: 1em;
    }
  }
`;

const Metadata = styled.p`
  font-weight: ${(props) => props.theme.value.font.light};

  &.forLocation {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

export default function DetailsContent() {
  const state = GlobalState(DInstance);
  const { data, loading } = state.get();

  return loading ? (
    <Notify message="Memuat detail" />
  ) : (
    <Content>
      <div className="first">
        <section className="imageSection">
          <Image
            thumbnail={data?.thumbnail ? data?.thumbnail : DetailsPlaceholder()}
          />
        </section>
        <section className="metaSection">
          <Metadata className="forLocation">{`${data?.location.kota}, ${data?.location.prov}`}</Metadata>
          <Metadata>Oleh: {data?.pengguna_name} </Metadata>
          <Metadata>Tipe: {data?.type} </Metadata>
          <Metadata>Publikasi: {data?.lapor_date.split("T")[0]} </Metadata>
          <Metadata>Status: {data?.status} </Metadata>
          <Metadata>Visibilitas: {data?.visibility} </Metadata>
        </section>
      </div>
      <div className="second">
        <section className="dSection">
          <Label htmlFor="dLaporan">deskripsi laporan</Label>
          <TextArea
            name="dLaporan"
            id="dLaporan"
            disabled
            defaultValue={data?.detail}
          ></TextArea>
        </section>
        <section className="resSection">
          <Response />
        </section>
      </div>
    </Content>
  );
}
