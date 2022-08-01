import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const localapi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: `./`,
      credentials:'include',
      mode: 'cors',
      validateStatus: (response)=>{
         return response.status >= 200 && response.status <= 299
      },
   }),
   reducerPath: 'localapi',
   endpoints: (builder)=>({
      channelLineup : builder.query({
         query: ()=>({
            url:`channelLineup.json`,
            method:"GET"
         })
      }),
      guideData : builder.query({
         query: ()=>({
            url:`guideData.json`,
            method:"GET"
         })
      })
   })
});

export const {
   useGuideDataQuery, 
   useChannelLineupQuery,
} = localapi