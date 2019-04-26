import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import routes from "./routes";
import withTracker from "./withTracker";
import store from './flux/store.js'

import Register from "./views/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

export default () => (
    <Router basename={process.env.REACT_APP_BASENAME || ""}>
      <div>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker(props => {
                let props2 = {...props, store}
                console.log(props2)
                return (
                  <route.layout>
                    <route.component {...props2}/>
                  </route.layout>
                );
              })}
            />
          );
        })}
      </div>
    </Router>
);
