import {api} from './index';
export const authApi = api.injectEndpoints({
   endpoints: (builder)=>({
      getLicense : builder.query({
         query: (app)=>({
            url:`/auth/register/`+app,
            method:"GET"
         }),
         providesTags:'appLicense'
      }),
      getShowtimeToken: builder.query({
         query:()=>({
            url:`/auth/showtime`,
            method:"GET"
         }),
         providesTags:'showtimeToken'
      }),
   })
})

export const {
   useGetLicenseQuery,
   useGetShowtimeTokenQuery
} = authApi
