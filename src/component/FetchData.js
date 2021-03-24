import { useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/",
});

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
          params: { page: page, limit: 10 },
        });
        console.log(response);
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

export { instance, useLaporanku };
