import React, {useEffect} from "react";
// import {useSelector} from "react-redux";
import {ThemeProvider, Global} from '@emotion/react'
import {getTheme} from './styles/themeManager'
import logger from './utils/logger'
import MainContentContainer from "./components/MainContentContainer";
import appManager from './utils/AppManager';
import { useHistory } from "react-router";
import keyHandler from "./utils/keyHandler";
import {navigator} from './utils/navigator';
import { useSelector, shallowEqual, useDispatch} from "react-redux";
import { setMiddlewareSocketState } from "./utils/hcap/hcapReducer";
import { setMode } from "./app/reducers";
import DebugCanvas from "./components/debug/DebugCanvas";

export default function App() {
   let dispatch = useDispatch()
   let history = useHistory();
   let appState = useSelector((state)=>{
      return {
         'mode': state.root.mode,
         'hcapSocketState': state.hcap.socketState,
         'appInitialized': state.root.appInitialized,
         'persona': state.root.persona
      }
   }, shallowEqual)

   useEffect(()=>{
      keyHandler.setHistory(history);
      navigator.history = history;
      window.addEventListener('hcap_opened', function(){
         dispatch(setMiddlewareSocketState('open'))
      })
   }, [dispatch, history])

   useEffect(()=>{
      if(appState.mode === 'bootup' && appState.appInitialized === false &&  appState.hcapSocketState === 'open'){
         logger.log("Conditions OK for startup");
         dispatch(setMode('initializing'))
         navigator.init();
         appManager.init().then((result)=>{
            logger.log("appManager.init complete");
            dispatch(setMode('normal'))
         })
      }
   }, [appState.mode, appState.appInitialized, appState.hcapSocketState, dispatch])
   const personaThemeMap = {
      'social': 'default',
      'business': 'default',
      'highend': 'default',
      'wedding': 'wedding'
   }
   const themeName = personaThemeMap[appState.persona];
   console.log(themeName)
   const theme = getTheme(personaThemeMap[themeName], personaThemeMap[themeName])
   return <ThemeProvider theme={theme}>
         <Global styles={theme.globals}/>
         {/* <DebugCanvas/> */}
         <MainContentContainer/>
      </ThemeProvider>
}