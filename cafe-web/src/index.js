import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import OrderSummery from'./Scripts/OrderSummery';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Status from './Scripts/Status'
import Fail from './Scripts/Status'


const routing = (
    <Router>
      <div>
        <Route exact  path="/OrderSummery" component={OrderSummery} />
        <Route  exact path="/" component={App} />
        <Route  exact path="/status" component={Status} />
        <Route  exact path="/fail" component={Fail} />



      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
