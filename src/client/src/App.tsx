import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/" component={Landing} />
    </Switch>
  </Router>
);

export default App;
