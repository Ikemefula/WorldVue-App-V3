//src/app/reducers/index.js
import {createSlice} from '@reduxjs/toolkit';
import {api as monitorApi} from '../api/monitorApi';
import {authApi} from '../api/auth';
const root = createSlice({
   name: 'root',
   initialState: {
      appInitialized: false,
      appInitMessage: null,
      isRequesting: false,
      mode: 'bootup',
      qrURL: null,
      showtimeToken: null,
      persona: "social"
   },
   reducers: {
      setPersona: (state, {payload})=>{
         state.persona = payload
      },
      setMode: (state, {payload})=>{
         state.mode = payload
      }
   },
   extraReducers: (builder)=>{
      builder.addMatcher(monitorApi.endpoints.getQRToken.matchFulfilled, (state, {payload})=>{
         state.qrURL = payload.token
      })
      builder.addMatcher(authApi.endpoints.getShowtimeToken.matchFulfilled, (state, {payload})=>{
         state.showtimeToken = payload.token
      })
   }
});

export const {setMode, setPersona} = root.actions;

export default root;