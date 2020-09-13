import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Redirect to="/landing" />
      </Route>
      <Route exact path="/landing">
        <Landing />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
    </Switch>
  </Router>
);

export default App;
