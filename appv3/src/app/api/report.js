import {api} from './index';
export const reportApi = api.injectEndpoints({
   endpoints: (builder)=>({
      reportStartup : builder.mutation({
         query: (body)=>({
            url:`/base/v3/startup`,
            method:"POST",
            body: body
         })
      }),
      reportState : builder.mutation({
         query: (body)=>({
            url:`/base/v3/state`,
            method:"POST",
            body: body
         })
      })
   })
})

export const {
   useReportStartupMutation,
   useReportStateMutation,
} = reportApi
