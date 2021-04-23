import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { useState as GlobalState } from "@hookstate/core";
import rfs from "rfsjs";

import Navbar from "component/Navbar";
import BuatLaporan from "component/BuatLaporan";
import SideDetails from "component/SideDetails";
import Laporanku from "component/Laporanku";
import LaporanPublik from "component/LaporanPublik";
import LaporanBaru from "component/LaporanBaru";
import Tanggapanku from "component/Tanggapanku";
import SemuaTanggapan from "component/SemuaTanggapan";
import Petugas from "component/Petugas";
import Pengaturan from "component/Pengaturan";
import { Modal } from "component/Modal";
import { Splash, NotFound } from "component/Splash";
import PrivateRoute from "util/PrivateRoute";
import { run_check_webp_feature } from "util/WebPCheck";
import { auth } from "util/Firebase";
import { fetchUserData } from "util/DataFetch";
import { Instance } from "util/States";

import BGWebP03 from "asset/mainBG_03.webp";
import BGProgressive from "asset/mainBG_Progressive.jpg";

const AppWrapper = styled.div`
  background-image: url(${run_check_webp_feature ? BGWebP03 : BGProgressive});
  background-size: cover;

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
  min-width: 760px;
  max-width: 100%;

  display: flex;
  position: relative;
  overflow: hidden;
`;

const View = styled.div`
  height: inherit;
  min-height: inherit;
  width: auto;
  margin-left: ${(props) => props.theme.value.UI.navbarDesktop};

  flex: 1;

  transition: ${(props) => props.theme.value.transition};
  transition-property: margin;

  @media only screen and (max-width: 858px) {
    margin-left: ${(props) => props.theme.value.UI.navbarDesktopSmall};
  }
`;

const WrapToaster = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1002;

  height: 100px;
  width: 100px;

  pointer-events: none;
`;

const Presisting = styled.div`
  background-color: ${(props) => props.theme.color.dark};
  color: ${(props) => props.theme.color.white};
  font-weight: ${(props) => props.theme.value.font.medium};
  ${rfs("2em", "font-size")}

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
  max-width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const state = GlobalState(Instance);
  // TODO: Handle this
  const [isLoading, setIsLoading] = useState(true);

  // check login status
  const callGetDetails = useCallback(
    async (user) => {
      var details = await fetchUserData(user.email);
      await state.session.set(details);
      setIsLoading(false);
    },
    [state.session]
  );

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged((user) => {
      if (user) {
        callGetDetails(user);
      } else {
        setIsLoading(false);
      }
    });

    return unsubs;
  }, [callGetDetails]);

  return isLoading ? (
    <Presisting>Mengambil state</Presisting>
  ) : (
    <AppWrapper id="AppWraper">
      <Router>
        <Navbar />
        <SideDetails />
        <WrapToaster>
          <Toaster
            toastOptions={{
              className: "toast",
            }}
          />
        </WrapToaster>
        <Modal />
        <View id="View">
          <Switch>
            <Route exact path="/" component={Splash} />
            <PrivateRoute path="/buatlaporan" comp={BuatLaporan} />
            <PrivateRoute path="/laporanku" comp={Laporanku} />
            <PrivateRoute path="/laporanpublik" comp={LaporanPublik} />
            <PrivateRoute path="/laporanbaru" comp={LaporanBaru} />
            <PrivateRoute path="/tanggapanku" comp={Tanggapanku} />
            <PrivateRoute path="/semuatanggapan" comp={SemuaTanggapan} />
            <PrivateRoute path="/petugas" comp={Petugas} />
            <PrivateRoute path="/pengaturan" comp={Pengaturan} />
            <Route component={NotFound} />
          </Switch>
        </View>
      </Router>
    </AppWrapper>
  );
}

export default App;
