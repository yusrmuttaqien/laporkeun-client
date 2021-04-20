export default function SemuaTanggapan(props) {
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
