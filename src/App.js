import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "component/Navbar";
import BuatLaporan from "component/BuatLaporan";
import Laporanku from "component/Laporanku";
import LaporanPublik from "component/LaporanPublik";
import LaporanBaru from "component/LaporanBaru";
import Tanggapanku from "component/Tanggapanku";
import SemuaTanggapan from "component/SemuaTanggapan";
import Petugas from "component/Petugas";
import Pengaturan from "component/Pengaturan";
import { Details } from "component/Details";
import Test from "component/Test";
import { Loading } from "util/Loading";
import { Popup } from "util/Popup";
import { Splash, NotFound } from "component/Splash";
import PrivateRoute from "util/PrivateRoute";
import { check_webp_feature } from "util/WebPCheck";
import { authCheck } from "util/MainFunctions";

import BGWebP from "asset/mainBG_WebP.webp";
import BGProgressive from "asset/mainBG_Progressive.jpg";

const AppWrapper = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
  min-width: 760px;
  max-width: 100%;

  background-image: url(${check_webp_feature("lossy")
    ? BGWebP
    : BGProgressive});
  background-size: cover;
`;

const View = styled.div`
  flex: 1;

  height: inherit;
  min-height: inherit;
  width: auto;
  margin-left: ${(props) => props.theme.value.UI.navbarDesktop};

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
  z-index: 1004;
  height: 100px;
  width: 100px;

  pointer-events: none;
`;

function App() {
  useEffect(() => {
    authCheck();
  }, []);

  return (
    <AppWrapper id="AppWraper">
      <Router>
        <Navbar />
        <WrapToaster>
          <Toaster
            toastOptions={{
              className: "toast",
            }}
          />
        </WrapToaster>
        <Details />
        <Popup />
        <Loading />
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
            <Route path="/test" component={Test} />
            <Route component={NotFound} />
          </Switch>
        </View>
      </Router>
    </AppWrapper>
  );
}

export default App;
