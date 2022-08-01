//src/app/reducers/index.js
import {createSlice} from '@reduxjs/toolkit';
const hcap = createSlice({
   name: 'root',
   initialState: {
      middlewarrSocketState: 'init',
      property: {},
      power:{
         mode:null
      },
      socket: {
         'tcpDaemonState': null
      },
      network: {
         'wifiDiagnostics':null,
         'networkDevices': [],
         'networkInformation': null
      },
      channel:{
         currentChannel:{
            'logicalNumber':null
         },
      }

   },
   reducers: {
      setMiddlewareSocketState: (state, {payload})=>{
         state.socketState = payload
      },
      setProperty: (state, {payload})=>{
         state.property[payload.property] = payload.value;
      },
      setPower: (state, {payload})=>{
         state.power[payload.property] = payload.value;
      },
      setDaemonSocket: (state, {payload})=>{
         state.socket[payload.property] = payload.value;
      },
      setNetworkState: (state, {payload})=>{
         state.network[payload.property] = payload.value;
      },
      networkRefresh: (state, {payload})=>{
         state.network.networkDevices = payload.networkDevices;
         state.network.networkInformation = payload.networkInformation;
      },
      setCurrentChannel: (state, {payload})=>{
         state.channel.currentChannel = payload;
      }
   },
   extraReducers: (builder)=>{

   }
});

export const {
   setMiddlewareSocketState,
   setDaemonSocket,
   setNetworkState,
   networkRefresh,
   setProperty,
   setPower,
   setCurrentChannel
} = hcap.actions;

export default hcap;