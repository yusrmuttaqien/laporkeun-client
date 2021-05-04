import { useEffect, useState } from "react";

import {} from "util/States";
import { database } from "util/Firebase";

// NOTE: Global fetch value
const options = [
  { value: "Date DESC", label: "Terbaru" },
  { value: "Date ASC", label: "Terlama" },
  // { value: "stat Menunggu", label: "Menunggu" },
  // { value: "stat Diterima", label: "Diterima" },
];

// NOTE: Main fetches
function fetchPetugas() {}

export { options, fetchPetugas };
