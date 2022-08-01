import "core-js"; 
import "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from 'react-redux';
import {HashRouter as Router} from 'react-router-dom';
import { store } from './app/store';
import hcap from './utils/hcap/hcap'
import {createBrowserHistory} from 'history';
export const history =  createBrowserHistory();

if(hcap.wci.isDev()){
   hcap.wci.toggleHcapLog(false)
}

let ReactRouter = Router;
ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <ReactRouter history={history}>
            <App />
         </ReactRouter>
      </Provider>
   </React.StrictMode>
, document.getElementById("app"));