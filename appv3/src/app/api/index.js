

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import site from '../config/site.json'

export const api = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: `http://${site.server.serverIp}:9050`,
      credentials:'include',
      mode: 'cors',
      validateStatus: (response)=>{
         return response.status >= 200 && response.status <= 299
      },
   }),
   tagTypes:['appLicense', 'showtimeToken'],
   endpoints: ()=>({})
});