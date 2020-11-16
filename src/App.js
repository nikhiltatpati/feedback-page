import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Feedback from "./pages/feedback";
import Admin from "./pages/admin";
import Home from "./pages/home";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <div className="wrapper">
            <Link to="/">
              <h1
                style={{
                  color: "white",
                }}
              >
                Requestly Test
              </h1>
            </Link>
          </div>
        </header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/feedback">
            <Feedback />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default App;
