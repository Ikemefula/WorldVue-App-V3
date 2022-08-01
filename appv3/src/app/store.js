import { configureStore, combineReducers} from '@reduxjs/toolkit';
import root from './reducers/index';
// import hcap from '../utils/hcap/hcap'
import hcapReducer from '../utils/hcap/hcapReducer';
import guide from '../features/guide/GuideReducer';
import applications from '../features/applications/AppsReducer';
import compendium from '../features/compendium/CompendiumReducer';
import {api} from './api/index'
import {api as monitorApi} from './api/monitorApi'
import {localapi} from './api/local'

const mainReducer = combineReducers({
  root: root.reducer,
  hcap: hcapReducer.reducer,
  guide: guide.reducer,
  applications: applications.reducer,
  compendium: compendium.reducer,
  [api.reducerPath]: api.reducer,
  [monitorApi.reducerPath]: monitorApi.reducer,
  [localapi.reducerPath]: localapi.reducer
})

export const store = configureStore({
  reducer: mainReducer,
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
    serializeableCheck: false,
    immutableCheck: false
  }).concat(api.middleware)
});
