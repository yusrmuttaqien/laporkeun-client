import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import rfs from "rfsjs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { usePetugas } from "util/CustomHooks";
import {
  ReportWrapper,
  Action,
  Report,
  ReportBody,
  Button,
  Label,
  Input,
  Warning,
} from "style/Components";
import { SchemaDaftarPetugas } from "util/ValidationSchema";
import { regisPetugas } from "util/DataFetch";

const options = [
  { value: "Date DESC", label: "Terbaru" },
  { value: "Date ASC", label: "Terlama" },
  // { value: "stat Menunggu", label: "Menunggu" },
  // { value: "stat Diterima", label: "Diterima" },
];

const CustomReport = styled(Report)`
  .reportHeader {
    display: inherit;
    align-items: center;
    justify-content: space-between;

    h1 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const CustomSelect = styled(Select)`
  background-color: transparent;
  outline: none;
  width: 200px;

  .Select__control {
    background-color: transparent;
    border-color: ${(props) => props.theme.color.grey};
    box-shadow: none;

    .Select__value-container--has-value {
      .Select__single-value {
        color: ${(props) => props.theme.color.grey};
      }
    }

    &:hover {
      border-color: ${(props) => props.theme.color.purple};
    }
  }

  .Select__menu {
    background-color: ${(props) => props.theme.color.darkTransparent};
    backdrop-filter: blur(${(props) => props.theme.value.blur});
  }

  .Select__option {
    &.Select__option--is-selected {
      background-color: ${(props) => props.theme.color.purple};

      &.Select__option--is-focused {
        background-color: ${(props) => props.theme.color.purple};
      }
    }

    &.Select__option--is-focused {
      background-color: transparent;
    }
  }

  @media only screen and (max-width: 950px) {
    width: 140px;
  }
`;

const ReportBodyCustomNotFound = styled(ReportBody)`
  justify-content: center;
  align-items: center;

  img {
    ${rfs("70%", "width")};
  }

  a {
    color: ${(props) => props.theme.color.white};
  }
`;

const ReportBodyCustom = styled(ReportBody)`
  position: relative;
  padding-right: 5px;
`;

const DataList = styled.div`
  /* background-color: ${(props) => props.theme.color.white}; */
  background-color: ${(props) => {
    if (props.stats === "Diterima") {
      return props.theme.color.done;
    } else if (props.stats === "Menunggu") {
      return props.theme.color.waiting;
    } else {
      return props.theme.color.white;
    }
  }};
  color: ${(props) => props.theme.color.dark};
  border-radius: ${(props) => props.theme.value.radius};

  display: inherit;
  justify-content: space-around;

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  ${Action} {
    width: 100px;
  }

  &:nth-child(1) {
    background-color: ${(props) => props.theme.color.purple};
    font-weight: ${(props) => props.theme.value.font.medium};
    color: ${(props) => props.theme.color.white};

    position: sticky;
    top: 0;

    cursor: default;

    ${Action} {
      cursor: default;
      width: 100px;
    }
  }

  section {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    text-align: center;

    &:nth-child(1) {
      font-weight: ${(props) => props.theme.value.font.medium};
    }
  }

  @media only screen and (max-width: 950px) {
    section {
      &:nth-child(2) {
        display: none;
      }
    }
  }
`;

const MoreButton = styled(Button)`
  margin-bottom: 0.5em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  button {
    font-weight: ${(props) => props.theme.value.font.medium};
    font-size: 1rem;
    border-radius: ${(props) => props.theme.value.radius};
    outline: none;
    border: none;
    transition: ${(props) => props.theme.value.transition};
    transition-property: background-color, color;

    padding: 0.3em 0;
    margin: 0.5em 0;

    &:hover {
      color: ${(props) => props.theme.color.white};
      background-color: ${(props) => props.theme.color.dark};
      cursor: pointer;
    }
  }

  p {
    color: ${(props) => props.theme.color.white};
    font-weight: ${(props) => props.theme.value.font.light};
    text-align: center;
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
  }
`;

const ForcedDataList = styled.div`
  background-color: ${(props) => props.theme.color.purple};
  font-weight: ${(props) => props.theme.value.font.medium};
  color: ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.value.radius};

  display: inherit;
  justify-content: space-around;

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  position: sticky;
  top: 0;

  cursor: default;

  ${Action} {
    cursor: default;
    width: 100px;
  }

  section {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    text-align: center;

    &:nth-child(1) {
      font-weight: ${(props) => props.theme.value.font.medium};
    }
  }

  @media only screen and (max-width: 950px) {
    section {
      &:nth-child(2) {
        display: none;
      }
    }
  }
`;

const CustomAction = styled(Action)`
  flex-direction: row;
  justify-content: center;
  align-self: center;

  width: max-content;
  margin: 1em 0;

  span {
    margin-left: 0.5em;
  }
`;

export default function Petugas() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [isRegister, setIsRegister] = useState(false);
  const [sort, setSort] = useState("Date DESC");

  const { loading, hasMore, petugas } = usePetugas(page, sort);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaDaftarPetugas),
  });

  const loadNext = () => {
    setPage(page + 1);
  };

  const hapusPetugas = ({ id_petugas }) => {
    //   func hapus petugas
    // toast.promise(, {
    //   loading: "Tunggu sebentar kawan :)",
    //   success: (msg) => {
    //     return msg;
    //   },
    //   error: (err) => err && err.toString(),
    // });
  };

  const onSubmit = (data) => {
    toast.promise(regisPetugas(data), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => {
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  const handleChange = (value) => {
    setSort(value.value);
    setPage(1);
  };

  const isRegisterSwitch = () => {
    setIsRegister(!isRegister);
  };

  return (
    <ReportWrapper>
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={handleChange}
          />
        </div>
        {petugas.length === 0 || loading ? (
          // NOTE: Redesign
          isRegister ? null : (
            <>
              <ReportBodyCustomNotFound>
                Tidak ada petugas
              </ReportBodyCustomNotFound>
              <MoreButton onClick={isRegisterSwitch}>Tambah petugas</MoreButton>
            </>
          )
        ) : isRegister === true ? null : (
          <ReportBodyCustom>
            <MoreButton onClick={isRegisterSwitch}>Tambah petugas</MoreButton>
            <ForcedDataList>
              <section title="Nama petugas">Nama petugas</section>
              <section>ID petugas</section>
              <section>Tanggal buat</section>
              <section>No telp</section>
              <Action>Hapus</Action>
            </ForcedDataList>
            {petugas.map(
              (petugas, index) =>
                petugas.name_petugas !== "laporkeun" && (
                  <DataList key={index}>
                    <section title={petugas.name_petugas}>
                      {petugas.name_petugas}
                    </section>
                    <section>{petugas.id_petugas}</section>
                    <section>{petugas.date_akun}</section>
                    <section title={petugas.telp}>{petugas.telp}</section>
                    <Action
                      title="Hapus petugas"
                      onClick={() => {
                        hapusPetugas(petugas);
                      }}
                    >
                      <span className="material-icons">delete_outline</span>
                    </Action>
                  </DataList>
                )
            )}
            {hasMore && <MoreButton onClick={loadNext}>Muat lagi</MoreButton>}
          </ReportBodyCustom>
        )}
        {isRegister && (
          <ReportBodyCustom>
            <CustomAction title="Kembali" onClick={isRegisterSwitch}>
              Kembali
              <span className="material-icons">logout</span>
            </CustomAction>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Label htmlFor="name">Nama</Label>
              <Input type="text" name="name" id="name" ref={register} />
              <Warning>{errors.name?.message}</Warning>
              <Label htmlFor="telp">Nomor telp</Label>
              <Input type="text" name="telp" id="telp" ref={register} />
              <Warning>{errors.telp?.message}</Warning>
              <Label htmlFor="kataSandi">Kata sandi</Label>
              <Input
                type="password"
                name="kataSandi"
                id="kataSandi"
                ref={register}
              />
              <Warning>{errors.kataSandi?.message}</Warning>
              <button type="submit">Daftarkan petugas</button>
            </Form>
          </ReportBodyCustom>
        )}
      </CustomReport>
    </ReportWrapper>
  );
}
