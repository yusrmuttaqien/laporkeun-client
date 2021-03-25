import styled from "styled-components";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useStoreRehydrated } from "easy-peasy";

import BGWebP from "./asset/mainBG.webp";
import BGProgressive from "./asset/mainBG_Progressive.jpg";
import Navbar from "./component/Navbar";
import { Splash, NotFound } from "./component/Splash";
import BuatLaporan from "./component/BuatLaporan";
import { run_check_webp_feature } from "./component/Function";
import {
  LaporanBaru,
  Laporanku,
  LaporanPublik,
  Tanggapanku
} from "./component/LihatLaporan";
import SideDetails from "./component/SideDetails";
import PrivateRoute from "./component/PrivateRoute";
import rfs from "./component/RFS";

const AppWrapper = styled.div`
  background-image: url(${run_check_webp_feature ? BGWebP : BGProgressive});
  background-size: cover;

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
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
  const isRehydrated = useStoreRehydrated();

  return isRehydrated ? (
    <AppWrapper id="AppWraper">
      <Router>
        <Navbar />
        <SideDetails />
        <WrapToaster>
          <Toaster toastOptions={{ className: "toast" }} />
        </WrapToaster>
        <View id="View">
          <Switch>
            <Route exact path="/" component={Splash} />
            <PrivateRoute path="/buatlaporan" comp={BuatLaporan} />
            <PrivateRoute path="/laporanku" comp={Laporanku} />
            <PrivateRoute path="/laporanpublik" comp={LaporanPublik} />
            <PrivateRoute path="/laporanbaru" comp={LaporanBaru} />
            <PrivateRoute path="/tanggapanku" comp={Tanggapanku} />
            <PrivateRoute path="/petugas" comp={Laporanku} />
            <Route component={NotFound} />
          </Switch>
        </View>
      </Router>
    </AppWrapper>
  ) : (
    <Presisting>Mengambil State</Presisting>
  );
}

export default App;
