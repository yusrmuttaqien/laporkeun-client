//  NOTE: Remove on build
// import '@hookstate/devtools'

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import App from "./App";
import { GlobalStyle, Variables } from "style/Global";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={Variables}>
      <App />
      <GlobalStyle />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
