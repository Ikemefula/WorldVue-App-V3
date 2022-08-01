import {createSlice} from '@reduxjs/toolkit';

const applications = createSlice({
   name: 'applications',
   initialState: {
      'installedApps': [],
      'focusApp': null
   },
   reducers: {
      setInstalledApps: (state, {payload})=>{
         state.installedApps = payload;
      }, 
      setFocusApp: (state, {payload})=>{
         state.focusApp = payload
      }
   },
   extraReducers: {}
});

export const {
   setInstalledApps,
   setFocusApp
} = applications.actions

export default applications