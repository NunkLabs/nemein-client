import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Redirect to='/landing' />
      </Route>
      <Route exact path="/landing">
        <Landing />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
