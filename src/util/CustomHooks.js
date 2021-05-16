import { useEffect, useState } from "react";
import axios from "axios";
import { storage } from "util/Firebase";
import toast from "react-hot-toast";
import { useState as GlobalState } from "@hookstate/core";

import { DataInstance, DInstance } from "util/States";
import { database } from "util/Firebase";

const instance = axios.create({
  baseURL: "http://localhost:5006/",
});

const PaginationLimit = 10;

function useLaporanku(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanku, setLaporanku] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setLaporanku([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanku", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
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
  }, [page, setLaporanku, token, sort]);

  return { loading, error, hasMore, laporanku };
}

function usePetugas(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petugas, setPetugas] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setPetugas([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/petugas/list", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
        });
        setPetugas();
        setHasMore(response.data.info.next ? true : false);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    fetch();
  }, [page, setPetugas, token, sort]);

  return { loading, error, hasMore, petugas };
}

function useLaporanPublik(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanpublik, setLaporanpublik] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setLaporanpublik([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanpublik", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
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
  }, [page, setLaporanpublik, token, sort]);

  return { loading, error, hasMore, laporanpublik };
}

function useLaporanBaru(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [laporanbaru, setLaporanbaru] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setLaporanbaru([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/laporanbaru", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
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
  }, [page, setLaporanbaru, token, sort]);

  return { loading, error, hasMore, laporanbaru };
}

function useTanggapanku(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tanggapanku, setTanggapanku] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setTanggapanku([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/tanggapanku", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
        });
        setTanggapanku((prevTanggapanku) => {
          return [
            ...prevTanggapanku,
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
  }, [page, setTanggapanku, token, sort]);

  return { loading, error, hasMore, tanggapanku };
}

function useSemuaTanggapan(page, sort) {
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [semuaTanggapan, setSemuaTanggapan] = useState([]);

  const state = GlobalState(DataInstance);
  const { token } = state.session.get();

  useEffect(() => {
    setSemuaTanggapan([]);
  }, [sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    async function fetch() {
      try {
        const response = await instance.get("/laporan/semuatanggapan", {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { page: page, limit: PaginationLimit, sort: sort },
        });
        setSemuaTanggapan((prevSemuaTanggapan) => {
          return [
            ...prevSemuaTanggapan,
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
  }, [page, setSemuaTanggapan, token, sort]);

  return { loading, error, hasMore, semuaTanggapan };
}

function useDetails() {
  const DataState = GlobalState(DataInstance);
  const SDState = GlobalState(DInstance);
  const { token } = DataState.session.get();
  const sideDetailsPayload = SDState.payload.get();

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
    loc: null,
  });

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
            console.log(payload);
            // set response by id report
            // setResponseByIDReport(payload.id_report);
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
            // set response by id report
            // setResponseByIDReport(payload.id_report);
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
  }, [backToJSON.id, backToJSON.nik, backToJSON.petugas, token]);

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
  useSemuaTanggapan,
};
