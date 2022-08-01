import {createSlice} from '@reduxjs/toolkit';

const compendium = createSlice({
   name: 'applications',
   initialState: {
      'focusItem': null
   },
   reducers: {
      setFocusItem: (state, {payload})=>{
         state.focusItem = payload
      }
   },
   extraReducers: {}
});

export const {
   setFocusItem
} = compendium.actions

export default compendium