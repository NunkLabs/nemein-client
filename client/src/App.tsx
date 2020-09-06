import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): JSX.Element => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
    </Switch>
  </BrowserRouter>
);

export default App;
