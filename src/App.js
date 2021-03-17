import styled from "styled-components";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import BGWebP from "./asset/mainBG.webp";
import BGProgressive from "./asset/mainBG_Progressive.jpg";
import Navbar from "./component/Navbar";
import { Splash, NotFound } from "./component/Splash";
import BuatLaporan from "./component/BuatLaporan";
import { run_check_webp_feature } from "./component/Function";

const AppWrapper = styled.div`
  background-image: url(${run_check_webp_feature ? BGWebP : BGProgressive});
  background-size: cover;

  height: 100vh;
  min-height: 640px; // TODO: Fix for mobile devices
  width: 100vw;
  max-width: 100%;

  display: flex;
  position: relative;
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

// TODO: Add dynamics with redux
function App() {
  return (
    <AppWrapper id="AppWraper">
      <Router>
        <Navbar />
        <View id="View">
          <Switch>
            <Route exact path="/" component={Splash} />
            <Route path="/buatlaporan" component={BuatLaporan} />
            <Route component={NotFound} />
          </Switch>
        </View>
      </Router>
    </AppWrapper>
  );
}

export default App;
