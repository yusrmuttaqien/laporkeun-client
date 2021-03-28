import { useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import axios from "axios";
import { storage } from "./util/Firebase";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: "http://localhost:5006/",
});

const PaginationLimit = 10;

function useLaporanku(page) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanku, setLaporanku] = useState([]);

  const { token } = useStoreState((state) => ({
    token: state.session.token,
  }));

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanku", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit },
        });
        setLaporanku((prevLaporanku) => {
          return [
            ...prevLaporanku,
            ...response.data.output.map((data) => {
              const { report } = data;
              return {
                id_report: report.id_report,
                title: report.title,
                date_report: report.date_report,
                vis: report.vis,
                stat: report.stat,
                NIK: report.NIK,
              };
            }),
          ];
        });
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setLaporanku, token]);

  return { loading, error, hasMore, laporanku };
}

function usePetugas(page) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petugas, setPetugas] = useState([]);

  const { token } = useStoreState((state) => ({
    token: state.session.token,
  }));

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/petugas/list", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit },
        });
        setPetugas((prevPetugas) => {
          return [
            ...prevPetugas,
            ...response.data.output.map((datas) => {
              const { report } = datas;
              return {
                name_petugas: report.name_petugas,
                id_petugas: report.id_petugas,
                date_akun: report.date_akun,
                telp: report.telp,
              };
            }),
          ];
        });
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setPetugas, token]);

  return { loading, error, hasMore, petugas };
}

function useLaporanPublik(page) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanpublik, setLaporanpublik] = useState([]);

  const { token } = useStoreState((state) => ({
    token: state.session.token,
  }));

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanpublik", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit },
        });
        setLaporanpublik((prevLaporanPublik) => {
          return [
            ...prevLaporanPublik,
            ...response.data.output.map((data) => {
              const { report } = data;
              return {
                id_report: report.id_report,
                title: report.title,
                date_report: report.date_report,
                vis: report.vis,
                stat: report.stat,
                NIK: report.NIK,
              };
            }),
          ];
        });
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setLaporanpublik, token]);

  return { loading, error, hasMore, laporanpublik };
}

function useLaporanBaru(page) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanbaru, setLaporanbaru] = useState([]);

  const { token } = useStoreState((state) => ({
    token: state.session.token,
  }));

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanbaru", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit },
        });
        setLaporanbaru((prevLaporanbaru) => {
          return [
            ...prevLaporanbaru,
            ...response.data.output.map((data) => {
              const { report } = data;
              return {
                id_report: report.id_report,
                title: report.title,
                date_report: report.date_report,
                vis: report.vis,
                stat: report.stat,
                NIK: report.NIK,
              };
            }),
          ];
        });
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setLaporanbaru, token]);

  return { loading, error, hasMore, laporanbaru };
}

function useTanggapanku(page) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanbaru, setLaporanbaru] = useState([]);

  const { token } = useStoreState((state) => ({
    token: state.session.token,
  }));

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/tanggapanku", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit },
        });
        setLaporanbaru((prevLaporanbaru) => {
          return [
            ...prevLaporanbaru,
            ...response.data.output.map((data) => {
              const { report } = data;
              return {
                id_report: report.id_report,
                title: report.report.title,
                id_petugas: report.id_petugas,
                date_response: report.date_response,
                stat: report.report.stat,
                NIK: report.NIK,
              };
            }),
          ];
        });
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setLaporanbaru, token]);

  return { loading, error, hasMore, laporanbaru };
}

function useDetails() {
  const { sideDetailsPayload, token } = useStoreState((state) => ({
    sideDetailsPayload: state.sideDetailsPayload,
    token: state.session.token,
  }));
  const [activeDetails, setActiveDetails] = useState({
    id_report: null,
    id_petugas: null,
    id_response: null,
    pic: null,
    title: null,
    report: null,
    date_report: null,
    date_response: null,
    vis: null,
    stat: null,
    response: null,
    NIK: null,
    name_pengguna: null,
    name_petugas: null,
  });
  const { setResponseByIDReport } = useStoreActions((actions) => ({
    setResponseByIDReport: actions.setResponseByIDReport,
  }));

  var backToJSON = JSON.stringify(sideDetailsPayload, undefined, 2);
  backToJSON = JSON.parse(backToJSON);

  useEffect(() => {
    const fetch = async () => {
      if (backToJSON.id && token) {
        if (backToJSON.nik) {
          try {
            const response = await instance.get("/laporan/detail", {
              headers: { authorization: `Bearer ${token}` },
              params: { id: backToJSON.id, nik: backToJSON.nik },
            });
            if (response.data.output.pic) {
              response.data.output.pic = await storage
                .ref(`/image/${response.data.output.pic}`)
                .getDownloadURL();
            }
            const payload = response.data.output;
            setResponseByIDReport(payload.id_report);
            setActiveDetails({
              ...payload,
              name_petugas: payload.name_petugas
                ? payload.name_petugas
                : payload.response
                ? "(petugas telah dihapus)"
                : null,
            });
            return 0;
          } catch (err) {
            toast.error(err.response.data.notify && err.response.data.notify);
            return 1;
          }
        } else if (backToJSON.petugas) {
          try {
            const response = await instance.get("/laporan/detailPetugas", {
              headers: { authorization: `Bearer ${token}` },
              params: {
                id: backToJSON.id,
                petugas: backToJSON.petugas,
              },
            });
            if (response.data.output.pic) {
              response.data.output.pic = await storage
                .ref(`/image/${response.data.output.pic}`)
                .getDownloadURL();
            }
            const payload = response.data.output;
            setResponseByIDReport(payload.id_report);
            setActiveDetails({
              ...payload,
              name_petugas: payload.name_petugas
                ? payload.name_petugas
                : payload.response
                ? "(petugas telah dihapus)"
                : null,
            });
            return 0;
          } catch (err) {
            toast.error(err.response.data.notify && err.response.data.notify);
            return 1;
          }
        }
      }
    };
    fetch();
  }, [
    backToJSON.id,
    backToJSON.nik,
    backToJSON.petugas,
    token,
    setResponseByIDReport,
  ]);

  return { activeDetails };
}

export {
  instance,
  useLaporanku,
  useLaporanPublik,
  useLaporanBaru,
  useTanggapanku,
  usePetugas,
  useDetails,
};
