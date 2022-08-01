import React, { useEffect, useRef, useState, useCallback} from 'react';
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux';
import { navigator } from '../utils/navigator';
import NavItem from '../components/navigation/NavItem';
import anime from 'animejs';
import CurrentConditions from '../components/decorators/CurrentConditions';
import WebRemoteQR from '../components/WebRemoteQR';
import keyHandler from '../utils/keyHandler';
import channelManager from '../utils/ChannelManager';
import HcapApplication from '../utils/hcap/hcapApplication';
import HcapPreloadedApplication from '../utils/hcap/hcapPreloadedApplication';
// import DebugPanel from '../components/debug/debugPanel';
import logo from '../styles/assets/images/logo-worldvue-white.svg?url';
import AdBar from '../components/AdBar';
import { setPersona } from '../app/reducers';
import {useTheme} from '@emotion/react'
//TODO
//break the subcomponents into seperate files.

const PortalPage = (props)=>{
   let dispatch = useDispatch();
   useEffect(()=>{
      keyHandler.resetKeyMap();
      keyHandler.setKeyMap({
         'chup': async ()=>{
            await channelManager.channelUp()
            navigator.gotoPage('/tv')
         },
         'chdown': async ()=>{
            await channelManager.channelDown()
            navigator.gotoPage('/tv')
         },
         'exit':()=>{
            navigator.gotoPage("/tv")
         },
         //debugging registration process for LG
         'yellow': async ()=>{
            dispatch(setPersona("social"))
         },
         'blue': async ()=>{
            dispatch(setPersona("business"))
         },
         'red': async ()=>{
            dispatch(setPersona("highend"))
         },
         'green': async ()=>{
            dispatch(setPersona("wedding"))
         },
      });
   }, [])

   const persona = useSelector((state)=>{
      return state.root.persona
   })

   return <div css={theme=>theme.portalPage.pageContainer}>
         {/* <DebugPanel/> */}
         <SideBlade transitionState={props.transitionState}/>
         <WelcomeMessage transitionState={props.transitionState}/>
         <Menu transitionState={props.transitionState}/>
         <AdBar persona={persona}/>
      </div>
}

const animateBottomIn = (el)=>{
   anime({
      targets:el,
      translateY:112,
      duration:500,
      easing: 'easeOutExpo',
      complete: ()=>{
         navigator.flow(true);
      }
   })
}

const animateBottomOut=(el)=>{
   anime({
      targets:el,
      translateY:-112,
      duration:500,
      easing: 'easeInExpo'
   })
}

const animateSideIn = (el)=>{
   anime({
      targets:el,
      translateX:951,
      duration:500,
      easing: 'easeOutExpo'
   })
}

const animateSideOut=(el)=>{
   anime({
      targets:el,
      translateX:-951,
      duration:500,
      easing: 'easeInExpo'
   })
}


const Menu = (props) =>{
   let containerRef = useRef()
   useEffect(()=>{
      //calculate navigation data structure on mount
      if(props.transitionState === 'entered'){
         navigator.flow(true)
      }
      else if(props.transitionState === 'entering'){
         animateBottomIn(containerRef.current)
      }
      else if(props.transitionState === 'exiting'){
         animateBottomOut(containerRef.current)
      }
   },[props.transitionState])


   return <div ref={containerRef} css={(theme)=>(theme.mainMenu.container)}>
      <div style={{position:'absolute', left: 0,  paddingLeft: '50px'}}>
         <img style={{height:"38px"}} src={logo} alt='Worldvue Logo'/>
      </div>
      <div css={(theme)=>(theme.portalPage.menuItemsContainer)}>
         <NavItem action={{'type': "GOTO", 'route': "/"}} navkey={'tv_item'} component={MarginDiv}>
            <MenuItem>{"HOME"} </MenuItem>
         </NavItem>
         <NavItem action={{'type': "GOTO", 'route': "/tv"}} navkey={'tv_item'} component={MarginDiv}>
            <MenuItem>{"LIVE TV"} </MenuItem>
         </NavItem>
         <NavItem action={{'type': "GOTO", 'route': "/guide"}}  navkey={'guide_item'} component={MarginDiv}>
            <MenuItem>{"GUIDE"} </MenuItem>
         </NavItem>
         <NavItem navkey={'apps_item'} action={{'type': "GOTO", 'route': "/applications"}} component={MarginDiv}>
            <MenuItem>{"APPS"}</MenuItem>
         </NavItem>
         <NavItem navkey={'comp_item'} action={{'type': "GOTO", 'route': "/compendium"}} component={MarginDiv}>
            <MenuItem>{"RESORT SERVICES"}</MenuItem>
         </NavItem>
      </div>
      <div style={{'width':'254px', position:'absolute',  'right': 0,  paddingRight:'119px'}}>
         <CurrentConditions />
      </div>
   </div>
}
const MarginDiv = styled.div`
  margin-right: 1px;
`
const MenuItem = (props)=>{
   const getStyle = (theme)=>{
      if(props.selected){
         return theme.portalPage.portalMenuItemSelected
      }
      return theme.portalPage.portalMenuItem
   }
   return <div css={getStyle}>
      {props.children}
   </div>
}


const WelcomeMessage = (props)=>{
   const {portalPage} = useTheme()
   const myRef = useRef()
   useEffect(()=>{
      if(props.transitionState === 'entering'){
         anime({
            targets:myRef.current,
            opacity:1,
            duration:500,
            easing: 'easeOutExpo',
         })
      }
      else if(props.transitionState === 'exiting'){
         anime({
            targets:myRef.current,
            opacity:0,
            duration:500,
            easing: 'easeOutExpo',
         })
      }
   }, [props.transitionState])

   const persona = useSelector((state)=>{
      return state.root.persona
   })

   const Message = status[persona]

   return <div ref={myRef} css={portalPage.welcomeContainer}>
      <div css={(theme)=>{
         console.log(theme.portalPage)
         return theme.portalPage.welcomeHeader
      }}>
         {<Message/>}
      </div>
      <div css={portalPage.welcomeName}>{guestNames[persona]}</div>
      <div css={portalPage.welcomeMessage}> THANK YOU FOR STOPPING BY!</div>
   </div>
}

const status = {
   'social': (props)=>{
      return <React.Fragment>
         WELCOME<br/>
         GOLD<br/>
         GUEST<br/>
      </React.Fragment>
   },
   'business': ()=>{
      return <React.Fragment>
         WELCOME<br/>
         PLATINUM<br/>
         GUEST<br/>
      </React.Fragment>
   },
   'highend': ()=>{
      return <React.Fragment>
         WELCOME<br/>
         DIAMOND<br/>
         GUEST<br/>
      </React.Fragment>
   },
   'wedding': ()=>{
      return <React.Fragment>
         WELCOME<br/>
         BRIDAL<br/>
         MEMBER<br/>
      </React.Fragment>
   },
}

const guestNames = {
   'social': 'JOHN SMITH',
   'business': 'JANE DOE',
   'highend': 'JAMES SMITH',
   'wedding': 'MARIA GARCIA'
}


const SideBlade = (props)=>{
   let thisRef = useRef();
   useEffect(()=>{
      //calculate navigation data structure on mount
      if(props.transitionState === 'entering'){
         animateSideIn(thisRef.current)
      }
      else if(props.transitionState === 'exiting'){
         animateSideOut(thisRef.current)
      }
   },[props.transitionState])

   return <div ref={thisRef} css={(theme)=>(theme.portalPage.sidePanel)}>
      {/* <WebRemoteQR /> */}
   </div>
}

export default PortalPage
