import React, { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";

import defaultUser from "./../asset/defaultUser.svg";

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

const CustomFormWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 60%;
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

const MoreButton = styled(Button)`
  margin-bottom: 0.5em;
`;

const SchemaDaftar = yup.object().shape({
  telp: yup
    .number()
    .required("Nomor wajib diisi")
    .test("len", "Nomor minimal 10 digit", (val) => val.toString().length >= 10)
    .test(
      "lenmin",
      "Nomor maksimal 15 digit",
      (val) => val.toString().length <= 15
    )
    .typeError("Nomor harus berupa angka")
    .positive("Nomor berupa bilangan positif")
    .integer("Nomor berupa bilangan bulat"),
  name: yup
    .string()
    .required("Nama wajib diisi")
    .max(30, "Nama maks 30 karakter"),
  kataSandi: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

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

const CustomButton = styled(Button)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CustomInput = styled.input`
  display: none;
`;

const CustomLabel = styled.label`
  appearance: none;
  cursor: pointer;
`;

const SettingWrapper = styled.form`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;

  section {
    display: inherit;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      width: 60%;

      img {
        width: 50%;
        margin-bottom: 2em;
      }
    }

    &:nth-child(2) {
      flex: 1;
    }
  }
`;

const options = [
  { value: "Date DESC", label: "Terbaru" },
  { value: "Date ASC", label: "Terlama" },
  // { value: "stat Menunggu", label: "Menunggu" },
  // { value: "stat Diterima", label: "Diterima" },
];

function Laporanku(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { loading, hasMore, laporanku } = useLaporanku(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
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
              <Action>Detail</Action>
            </DataList>
            {laporanku.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(true);
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
      </CustomReport>
    </ReportWrapper>
  );
}

function LaporanPublik(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { loading, hasMore, laporanpublik } = useLaporanPublik(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
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
              <Action>Detail</Action>
            </DataList>
            {laporanpublik.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(true);
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
      </CustomReport>
    </ReportWrapper>
  );
}

function LaporanBaru(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { hasMore, laporanbaru } = useLaporanBaru(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
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
              <Action>Detail</Action>
            </DataList>
            {laporanbaru.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_report}</section>
                <section>{laporan.vis}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(true);
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
      </CustomReport>
    </ReportWrapper>
  );
}

function Tanggapanku(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { hasMore, tanggapanku } = useTanggapanku(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
        {tanggapanku.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section title="Tanggal respon">Tanggal respon</section>
              <section>ID petugas</section>
              <section>Status</section>
              <Action>Detail</Action>
            </DataList>
            {tanggapanku.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(true);
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
      </CustomReport>
    </ReportWrapper>
  );
}

function SemuaTanggapan(props) {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Date DESC");

  const { hasMore, semuaTanggapan } = useSemuaTanggapan(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
        {semuaTanggapan.length === 0 ? (
          // NOTE: Redesign
          <ReportBodyCustomNotFound>Tidak ada laporan</ReportBodyCustomNotFound>
        ) : (
          <ReportBodyCustom>
            <DataList>
              <section>Judul Laporan</section>
              <section title="Tanggal respon">Tanggal respon</section>
              <section>ID petugas</section>
              <section>Status</section>
              <Action>Detail</Action>
            </DataList>
            {semuaTanggapan.map((laporan, index) => (
              <DataList key={index} stats={laporan.stat}>
                <section title={laporan.title}>{laporan.title}</section>
                <section>{laporan.date_response}</section>
                <section>{laporan.id_petugas}</section>
                <section>{laporan.stat}</section>
                <Action
                  title="Buka Detail"
                  onClick={() => {
                    props.sd.setToggleSD(true);
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
      </CustomReport>
    </ReportWrapper>
  );
}

function Petugas() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const [page, setPage] = useState(1);
  const [isRegister, setIsRegister] = useState(false);
  const [sort, setSort] = useState("Date DESC");

  const { loading, hasMore, petugas } = usePetugas(page, sort);

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
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <CustomSelect
            options={options}
            classNamePrefix={"Select"}
            defaultValue={options[0]}
            placeholder="Urutkan dari"
            onChange={(value) => {
              setSort(value.value);
              setPage(1);
            }}
          />
        </div>
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
            <CustomAction
              title="Kembali"
              onClick={() => setIsRegister(!isRegister)}
            >
              Kembali
              <span className="material-icons">logout</span>
            </CustomAction>
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
              <button type="submit">Daftarkan petugas</button>
            </Form>
          </ReportBodyCustom>
        )}
      </CustomReport>
    </ReportWrapper>
  );
}

function Pengaturan() {
  let { pathname } = useLocation();
  pathname = pathname.substring(1);

  const { pic } = useStoreState((state) => ({
    pic: state.session.pic,
  }));

  const { updateProfile } = useStoreActions((actions) => ({
    updateProfile: actions.updateProfile,
  }));

  const [filename, setFileName] = useState("");
  const [aspectRatio, setAspectRatio] = useState();

  const FILE_SIZE = 1000000;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

  const SchemaSetting = yup.object().shape({
    telp: yup
      .number()
      .required("Nomor wajib diisi")
      .test(
        "len",
        "Nomor minimal 10 digit",
        (val) => val.toString().length >= 10
      )
      .test(
        "lenmin",
        "Nomor maksimal 15 digit",
        (val) => val.toString().length <= 15
      )
      .typeError("Nomor harus berupa angka")
      .positive("Nomor berupa bilangan positif")
      .integer("Nomor berupa bilangan bulat"),
    name: yup
      .string()
      .required("Nama wajib diisi")
      .max(30, "Nama maks 30 karakter"),
    kataSandi: yup
      .string()
      .required("Kata sandi wajib diisi")
      .min(8, "Kata sandi minimal 8 karakter"),
    pic: yup
      .mixed()
      .test("fileType", "Unsupported File Format", (value) => {
        if (value.length !== 0 && !SUPPORTED_FORMATS.includes(value[0].type)) {
          return false;
        } else {
          return true;
        }
      })
      .test("fileSize", "File Size is too large", (value) => {
        if (value.length !== 0 && value[0].size >= FILE_SIZE) {
          return false;
        } else {
          return true;
        }
      })
      .test("fileAspectRatio", "Rasio gambar harus 1:1 / persegi", (value) => {
        if (value.length !== 0 && aspectRatio !== 1) {
          return false;
        } else {
          return true;
        }
      }),
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(SchemaSetting),
  });

  const getFileName = (e) => {
    setFileName(e.target.files[0].name);
    const reader = new Image();
    reader.onload = async () => {
      await setAspectRatio(reader.height / reader.width);
    };
    reader.src = window.URL.createObjectURL(e.target.files[0]);
  };

  const history = useHistory();

  const onSubmit = (data) => {
    toast.promise(updateProfile(data), {
      loading: "Tunggu sebentar kawan :)",
      success: (msg) => {
        // history.go(0);
        return msg;
      },
      error: (err) => err && err.toString(),
    });
  };

  return (
    <ReportWrapper>
      <CustomReport>
        <div className="reportHeader">
          <h1 title={pathname}>{pathname}</h1>
          <Button type="submit" form="changeSetting">
            Simpan
          </Button>
        </div>
        <SettingWrapper
          id="changeSetting"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <section>
            <img src={pic ? pic : defaultUser} alt="" />
            <CustomButton
              type="button"
              title={
                errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"
              }
            >
              <CustomLabel htmlFor="pic">
                {errors.pic?.message
                  ? errors.pic?.message
                  : filename
                  ? filename
                  : "Ubah profil"}
              </CustomLabel>
              <CustomInput
                type="file"
                name="pic"
                id="pic"
                accept="image/x-png,image/gif,image/jpeg"
                ref={register}
                onChange={getFileName}
              />
            </CustomButton>
          </section>
          <section>
            <CustomFormWrapper>
              <Label htmlFor="name">Nama</Label>
              <Input type="text" name="name" id="name" ref={register} />
              <Warning>{errors.name?.message}</Warning>
              <Label htmlFor="telp">Telp</Label>
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
            </CustomFormWrapper>
          </section>
        </SettingWrapper>
      </CustomReport>
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
  Pengaturan,
};
