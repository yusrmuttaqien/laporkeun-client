import React from "react";
import styled from "styled-components";
import { useState as GlobalState } from "@hookstate/core";

import Image from "util/ImageView";
import Response from "component/DetailsResponse";
import { Label, TextArea, Notify } from "style/Components";
import { DInstance } from "util/States";

import DetailsPlaceholder from "asset/defaultReport.jpg";

const Metadata = styled.p`
  font-weight: ${(props) => props.theme.value.font.light};

  &.forLocation {
    margin-bottom: 1em;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

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
    align-items: center;
    height: 40%;

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

      .twoSided {
        display: inherit;
        flex-direction: row;

        .title {
          display: inherit;
          flex-direction: column;
          align-items: flex-end;

          ${Metadata} {
            font-weight: ${(props) => props.theme.value.font.medium};
          }
        }

        .content {
          margin-left: 1em;
          flex: 1;
        }
      }
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

export default function DetailsContent() {
  const state = GlobalState(DInstance);
  const { data, loading } = state.get();

  let tempDate = data?.lapor_date;
  let tempDateRespon =
    data?.petugas_name && data?.respon_date[data?.status.toLowerCase()];

  return !data ? (
    <Notify message="Memuat detail" />
  ) : (
    <Content>
      <div className="first">
        <section className="imageSection">
          <Image
            thumbnail={data?.thumbnail ? data?.thumbnail : DetailsPlaceholder}
            img={
              data?.picURL
                ? data?.picURL
                : data?.thumbnail
                ? data?.thumbnail
                : DetailsPlaceholder
            }
          />
        </section>
        <section className="metaSection">
          <Metadata className="forLocation">{`${data?.location.kota}, ${data?.location.prov}`}</Metadata>
          <div className="twoSided">
            <div className="title">
              <Metadata>Oleh:</Metadata>
              <Metadata>Tipe:</Metadata>
              <Metadata>Publikasi:</Metadata>
              <Metadata>Status:</Metadata>
              <Metadata>Visibilitas:</Metadata>
              {data?.petugas_name && (
                <>
                  <Metadata>Responden:</Metadata>
                  <Metadata>Tgl respon:</Metadata>
                </>
              )}
            </div>
            <div className="content">
              <Metadata>{data?.pengguna_name} </Metadata>
              <Metadata>{data?.type} </Metadata>
              <Metadata>{tempDate}</Metadata>
              <Metadata>{data?.status} </Metadata>
              <Metadata>{data?.visibility} </Metadata>
              {data?.petugas_name && (
                <>
                  <Metadata>{data?.petugas_name}</Metadata>
                  <Metadata>{tempDateRespon}</Metadata>
                </>
              )}
            </div>
          </div>
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
        <section className="resSection">{!loading && <Response />}</section>
      </div>
    </Content>
  );
}
