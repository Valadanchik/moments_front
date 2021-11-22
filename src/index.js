import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Main from './Router';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { GA_ID } from './config';
import ReactGA from 'react-ga';
ReactGA.initialize(GA_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

class Index extends Component {

  render() {

    return (
      <BrowserRouter>
        <Route component={Main} />
      </BrowserRouter>
    );
  }
}
ReactDOM.render(<Index/>, document.getElementById('root'));