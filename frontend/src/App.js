import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Video from "./components/Video/Video";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home}></Route>
        <Route path="/:url" component={Video}></Route>
      </Switch>
    </Router>
  );
};

export default App;
