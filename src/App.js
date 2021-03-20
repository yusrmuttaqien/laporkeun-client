import styled from "styled-components";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { createStore, StoreProvider } from "easy-peasy";

import BGWebP from "./asset/mainBG.webp";
import BGProgressive from "./asset/mainBG_Progressive.jpg";
import Navbar from "./component/Navbar";
import { Splash, NotFound } from "./component/Splash";
import BuatLaporan from "./component/BuatLaporan";
import { run_check_webp_feature } from "./component/Function";
import LihatLaporan from "./component/LihatLaporan";
import { state as GlobalState } from "./component/GlobalState";
import SideDetails from "./component/SideDetails";

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

const Store = createStore(GlobalState);

// TODO: Add dynamics with redux
function App() {
  return (
    <AppWrapper id="AppWraper">
      <StoreProvider store={Store}>
        <Router>
          <Navbar /> {/* we're here */}
          <SideDetails />
          <View id="View">
            <Switch>
              <Route exact path="/" component={Splash} />
              <Route path="/buatlaporan" component={BuatLaporan} />
              <Route path="/laporanku" component={LihatLaporan} />
              <Route path="/laporanpublik" component={LihatLaporan} />
              <Route path="/laporanbaru" component={LihatLaporan} />
              <Route path="/tanggapanku" component={LihatLaporan} />
              <Route path="/petugas" component={LihatLaporan} />
              <Route component={NotFound} />
            </Switch>
          </View>
        </Router>
      </StoreProvider>
    </AppWrapper>
  );
}

export default App;
