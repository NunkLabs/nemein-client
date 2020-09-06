import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Landing />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
