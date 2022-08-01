import React from 'react';
import {Route} from 'react-router-dom';
import PortalPage from '../features/PortalPage';
import GuidePage from '../features/guide/GuidePage';
import AppsPage from '../features/applications/AppsPage';
import FullTVPage from '../features/FullTvPage';
import CompendiumPage from '../features/compendium/CompendiumPage';
import { Transition } from 'react-transition-group';

const MainContentContainer = (props)=>{
   return <React.Fragment>
        <Route path='/compendium' component={CompendiumPage}>
         {({match})=>{
            return <Transition appear unmountOnExit timeout={501} in={match != null}>
            {(state)=>(<CompendiumPage transitionState={state}/>)}
         </Transition>
         }}
      </Route>
      <Route exact path='/'> 
         {({match})=>{
            return <Transition appear unmountOnExit timeout={501} in={match != null}>
            {(state)=>(<PortalPage transitionState={state}/>)}
         </Transition>
         }}
      </Route>
      <Route path='/guide'>
         {({match})=>{
            return <Transition appear unmountOnExit timeout={501} in={match != null}>
            {(state)=>(<GuidePage transitionState={state}/>)}
         </Transition>
         }}
      </Route>
      <Route path='/tv' component={FullTVPage}>
         {({match})=>{
            return <Transition appear unmountOnExit timeout={501} in={match != null}>
            {(state)=>(<FullTVPage transitionState={state}/>)}
         </Transition>
         }}
      </Route>
      <Route path='/applications' component={AppsPage}>
         {({match})=>{
            return <Transition appear unmountOnExit timeout={501} in={match != null}>
            {(state)=>(<AppsPage transitionState={state}/>)}
         </Transition>
         }}
      </Route>
    
   </React.Fragment>
}

export default MainContentContainer