import React from "react";
import Head from "./settings/Head";

//Routes
import Routes from "./routes";

import GlobalStyles from "./styles/global";
function App() {
  return (
    <div>
      <Head />
      <Routes />
      <GlobalStyles />
    </div>
  );
}

export default App;
