

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import site from '../config/site.json'

export const api = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: `http://${site.server.serverIp}:85`,
      credentials:'include',
      mode: 'cors',
      validateStatus: (response)=>{
         return response.status >= 200 && response.status <= 299
      },
   }),
   reducerPath: 'monitorapi',
   tagTypes:['webRemoteToken'],
   endpoints: (builder)=>({
      getQRToken: builder.query({
         query:(serialNumber)=>({
            url:`/remote/token/${serialNumber}`,
            method:"GET"
         }),
         providesTags:'webRemoteToken'
      }),
   })
});
