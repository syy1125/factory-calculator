import React from "react";
import "./App.css";
import { Main } from "./Main";
import { ThemeProvider } from "styled-components";

const theme = {
  fontSize: {
    title: 24,
    subtitle: 20
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Main />
      </div>
    </ThemeProvider>
  );
}

export default App;
