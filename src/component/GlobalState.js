import { action } from "easy-peasy";

export const state = {
  UI: {
    sideDetails: {
      onFocus: false,
    },
    formDefault: "Masuk",
  },
  session: {
    isLogged: true,
    role: "pengguna",
    name: "UserDefault",
    NIK: "7382956278295726",
    pic: null,
    telp: null,
  },
  activeDetail: {
    id_report: null,
    id_petugas: null,
    id_response: null,
    pic: null,
    title: "judul laporan",
    report:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dicta reiciendis ad quae! Voluptatibus soluta suscipit eligendi tenetur quas qui autem aliquid, quaerat sed labore sit atque mollitia pariatur aspernatur veniam ea eius iure corporis fugiat aperiam odio perspiciatis neque eos? Aut, blanditiis debitis nihil consequatur tempore facilis fugit quidem?Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci reiciendis dolore illo aut. Quod molestiae sed vero similique, illo, facilis, natus saepe mollitia dolores laborum doloremque facere? Explicabo voluptatem reprehenderit provident officia. Fugiat, accusantium repellat reiciendis error quas maiores inventore delectus facere repellendus itaque veniam numquam consequatur laboriosam sunt laudantium.",
    date: "03/10/2020",
    date_response: null,
    vis: "Publik",
    stat: "Diterima",
    response: "memsedih",
    NIK: null,
    name: null,
  },
  listLaporan: [
    {
      id_report: null,
      id_petugas: null,
      title: "judul laporan",
      date: "03/10/2021",
      date_response: "03/10/2021",
      vis: "Public",
      stat: "Diterima",
      NIK: null,
    },
  ],
  listPetugas: [
    {
      id_petugas: null,
      nama: null,
      telp: null,
      date: null,
    },
  ],

  // Action
  toggleFocusDetails: action((state) => {
    return {
      ...state,
      UI: {
        ...state.UI,
        sideDetails: {
          ...state.UI.sideDetails,
          onFocus: !state.UI.sideDetails.onFocus,
        },
      },
    };
  }),
  toggleFormDefault: action((state) => {
    return {
      ...state,
      UI: {
        ...state.UI,
        formDefault: state.UI.formDefault === "Masuk" ? "Daftar" : "Masuk",
      },
    };
  }),
};
