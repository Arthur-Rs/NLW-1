import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import CreatePoint from "./pages/CreatePoint";
import Home from "./pages/Home";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/create-point" component={CreatePoint} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
