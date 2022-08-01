import {site} from '../configs/site';
import {hcap} from '../hcap_extended';
// import {Logger} from './logger';
export const apiFetch = (request) => {
   //can be used fetching stuff outside of a redux action
   //basicaly the same as apiRequest without passing in the dispatch functinon.
   let endpoint = request.endpoint;
   let method = request.method;
   if (method === undefined) {
      method = 'GET';
   }
   let ip = site.server.ip;
   if(hcap.wci.isDev()){
      ip = site.server.devIp;
   }
   let url = 'http://'+ip +'/api'+ endpoint;
   let params = { method: 'GET', mode: 'cors', credentials: 'include' };
   if (method === 'POST') {
      let data = request.data;
      params.method = 'POST';
      params.body = JSON.stringify(data);
      params.headers = {
         'Content-Type': 'application/json; charset=utf-8',
         ...request.headers,
      };
   }
   return fetch(url, params)
}

export const localFetch = (endpoint) => {
   // used for getting localhost files like guide data.
   let params = { method: 'GET'};
   return fetch(endpoint, params)
}