import React, { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Report,
  ReportBody,
  ReportWrapper,
  Action,
  Button,
  Label,
  Input,
  Warning,
} from "./GlobalStyling";
import {
  useLaporanku,
  useLaporanPublik,
  useLaporanBaru,
  useTanggapanku,
  usePetugas,
  useSemuaTanggapan,
} from "./FetchData";
import rfs from "./RFS";

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

const ReportBodyCustom = styled(ReportBody)`
  position: relative;
  padding-right: 5px;
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

const DataList = styled.div`
  background-color: ${(props) => props.theme.color.white};
  color: ${(props) => props.theme.color.dark};
  border-radius: ${(props) => props.theme.value.radius};

  display: inherit;
  justify-content: space-around;

  padding: 0.3em 0.5em;
  margin-bottom: 0.5em;

  &:nth-child(1) {
    background-color: ${(props) => props.theme.color.purple};
    font-weight: ${(props) => props.theme.value.font.medium};
    color: ${(props) => props.theme.color.white};

    position: sticky;
    top: 0;

    cursor: default;

    ${Action} {
      cursor: default;
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

const SchemaDaftar = yup.object().shape({
  telp: yup
    .number()
    .required("NIK wajib diisi")
    .test("len", "Nomor minimal 10 digit", (val) => val.toString().length >= 10)
    .test(
      "lenmin",
      "Nomor maksimal 15 digit",
      (val) => val.toString().length <= 15
    )
    .typeError("NIK harus berupa angka")
    .positive("NIK berupa bilangan positif")
    .integer("NIK berupa bilangan bulat"),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

function Laporanku(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { loading, hasMore, laporanku } = useLaporanku(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanku.length === 0 || loading ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>
            Tidak ada laporan
            <Link to="/buatlaporan">Buat laporan disini</Link>
          </ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section>Tanggal lapor</section>
              <section>Visibilitas</section>
              <section>Status</section>
              <Action>Aksi</Action>
            </DataList>
            {laporanku.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(!props.sd.toggleSD);
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK });
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function LaporanPublik(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { loading, hasMore, laporanpublik } = useLaporanPublik(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanpublik.length === 0 || loading ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>
            Tidak ada laporan
            <Link to="/buatlaporan">Buat laporan disini</Link>
          </ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section>Tanggal lapor</section>
              <section>Visibilitas</section>
              <section>Status</section>
              <Action>Aksi</Action>
            </DataList>
            {laporanpublik.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(!props.sd.toggleSD);
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK });
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function LaporanBaru(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanbaru } = useLaporanBaru(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
    props.sd.setToggleSD(!props.sd.toggleSD);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanbaru.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section>Tanggal lapor</section>
              <section>Visibilitas</section>
              <section>Status</section>
              <Action>Aksi</Action>
            </DataList>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(!props.sd.toggleSD);
                    ToDetails({ id: laporan.id_report, nik: laporan.NIK });
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function Tanggapanku(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanbaru } = useTanggapanku(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanbaru.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section title="Tanggal respon">Tanggal respon</section>
              <section>ID petugas</section>
              <section>Status</section>
              <Action>Aksi</Action>
            </DataList>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(!props.sd.toggleSD);
                    ToDetails({
                      id: laporan.id_report,
                      petugas: laporan.id_petugas,
                    });
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function SemuaTanggapan(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const { hasMore, laporanbaru } = useSemuaTanggapan(page);

  const { detailReport } = useStoreActions((actions) => ({
    detailReport: actions.detailReport,
  }));

  const ToDetails = async (id_report) => {
    await detailReport(id_report);
  };

  const loadNext = () => {
    setPage(page + 1);
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {laporanbaru.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section title="Tanggal respon">Tanggal respon</section>
              <section>ID petugas</section>
              <section>Status</section>
              <Action>Aksi</Action>
            </DataList>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(!props.sd.toggleSD);
                    ToDetails({
                      id: laporan.id_report,
                      petugas: laporan.id_petugas,
                    });
                  }}
                >
                  <span className="material-icons">launch</span>
                </Action>
              </DataList>
            ))}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

function Petugas() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [isRegister, setIsRegister] = useState(false);
  const { loading, hasMore, petugas } = usePetugas(page);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaDaftar),
  });

  const { petugasRegistration, deletePetugas } = useStoreActions((actions) => ({
    petugasRegistration: actions.petugasRegistration,
    deletePetugas: actions.deletePetugas,
  }));

  const history = useHistory();

  const loadNext = () => {
    setPage(page + 1);
  };

  const hapusPetugas = (id) => {
    toast.promise(deletePetugas(id), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => {
        history.go(0);
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  const onSubmit = (data) => {
    toast.promise(petugasRegistration(data), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => {
        history.go(0);
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  return (
    <ReportWrapper>
      <Report>
        <h1>{pathname}</h1>
        {petugas.length === 0 || loading ? (
          // NOTE: Redesign
          isRegister ? null : (
            <>
              <ReportBodyCustomNotFound>
                Tidak ada petugas
              </ReportBodyCustomNotFound>
              <MoreButton onClick={() => setIsRegister(!isRegister)}>
                Tambah petugas
              </MoreButton>
            </>
          )
        ) : isRegister === true ? null : (
          <ReportBodyCustom>
            <MoreButton onClick={() => setIsRegister(!isRegister)}>
              Tambah petugas
            </MoreButton>
            <ForcedDataList>
              <section title="Nama petugas">Nama petugas</section>
              <section>ID petugas</section>
              <section>Tanggal buat</section>
              <section>No telp</section>
              <Action>Aksi</Action>
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
                        hapusPetugas(petugas.id_petugas);
                      }}
                    >
                      <span className="material-icons">delete_outline</span>
                    </Action>
                  </DataList>
                )
            )}
            {hasMore && (
              <MoreButton onClick={() => loadNext()}>Muat lagi</MoreButton>
            )}
          </ReportBodyCustom>
        )}
        {isRegister && (
          <ReportBodyCustom>
            <Action title="Kembali" onClick={() => setIsRegister(!isRegister)}>
              <span className="material-icons">logout</span>
            </Action>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Label htmlFor="name">Nama</Label>
              <Input type="text" name="name" id="name" ref={register} />
              <Warning>{errors.name?.message}</Warning>
              <Label htmlFor="telp">Nomor telp</Label>
              <Input type="number" name="telp" id="telp" ref={register} />
              <Warning>{errors.telp?.message}</Warning>
              <Label htmlFor="kataSandi">Kata sandi</Label>
              <Input
                type="password"
                name="kataSandi"
                id="kataSandi"
                ref={register}
              />
              <Warning>{errors.kataSandi?.message}</Warning>
              <button type="submit">Daftar</button>
            </Form>
          </ReportBodyCustom>
        )}
      </Report>
    </ReportWrapper>
  );
}

export {
  Laporanku,
  LaporanPublik,
  LaporanBaru,
  Tanggapanku,
  Petugas,
  SemuaTanggapan,
};
