import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import reportWebVitals from "./reportWebVitals";
import { createStore, StoreProvider } from "easy-peasy";

import App from "./App";
import { GlobalStyle, Theme } from "./component/GlobalStyling";
import { state } from "./component/GlobalState";

const Store = createStore(state);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={Store}>
      <ThemeProvider theme={Theme}>
        <App />
        <GlobalStyle />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
