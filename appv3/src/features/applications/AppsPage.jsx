//src/components/applications/AppPage.jsx
import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector , useDispatch, shallowEqual} from 'react-redux';
import NavItem from '../../components/navigation/NavItem';
import HcapPreloadedApplication from '../../utils/hcap/hcapPreloadedApplication';
import HcapApplication from '../../utils/hcap/hcapApplication';
import {setFocusApp} from './AppsReducer';
import amazonImage from '../../styles/assets/icons/app/Amazon_Prime_Video_logo.svg?url';
import pandoraImage from '../../styles/assets/icons/app/Pandora_logo.svg?url';
import netflixImage from '../../styles/assets/icons/app/Netflix_2015_logo.svg?url';
import bluetoothImage from '../../styles/assets/icons/app/BluetoothLogo.svg?url';
import showtimeImage from '../../styles/assets/icons/app/Showtime.svg?url';
import YouTubeImage from '../../styles/assets/icons/app/YouTube_Logo_2017.svg?url';
import {useGetShowtimeTokenQuery} from '../../app/api/auth';
import Hasher from '../../utils/Hasher';
import image from '../../styles/assets/images/guidePanelCity.png';
import anime from 'animejs';
import {css, useTheme} from '@emotion/react'
//this list will eventually come from a config file
export const applist = [
   {
      "launch_id": "244115188075859013",
      "preloaded": true, //use hcap.preloadedApplication.launchPreloadedApplication
      "title": "Netflix",
      "name": "Netflix",
      "desc": "Instantly stream thousands of your favorite TV shows, previews, and original series.",
      "containerClass": "netflixContainer",
      "image": netflixImage
   },
   {
      "preloaded": false, //use hcap.application.launchApplication
      "launch_id": "com.showtime.app.showtime.hotel",
      "title": "Showtime",
      "name": "Showtime",
      "desc": "Stream SHOWTIME for FREE -- no login or password required.\n\nChoose from a vast collection of SHOWTIME Original Series, Movies, Sports, Documentaries and more.",
      "containerClass": "showtimeContainer",
      "image": showtimeImage
   },
   {
      "launch_id": "144115188075859002",
      "preloaded": true,
      "title": "YouTube",
      "name": "YouTube",
      "desc": "Discover and watch your favorite videos and channels on YouTube.\n\nFrom comedy to music to sports, find the channels you love. Watching a video is just the beginning when you can like, share, comment, and more. By signing in to YouTube, you can easily access your subscribed channels, playlists, and more.",
      "containerClass": "youtubeContainer",
      "image": YouTubeImage
   },
   {
      'launch_id': "144115188075859015",
      "preloaded": true,
      'title': "Amazon Prime Video", //LG's app.title we get form the getPreloadedApplications list
      "name": "Amazon Prime Video",
      "desc": "Prime Video is Amazon's global streaming video service offering members unlimited streaming of Amazon's popular and award-winning Original Series, including Jack Ryan, The Man in the High Castle, and The Grand Tour, as well as popular Hollywood movies and TV shows, available to watch when, where and how you want.",
      "containerClass": 'amazonContainer',
      "image": amazonImage
   },
   {
      "launch_id": "244115188075859022",
      "preloaded": true,
      "title": "Pandora",
      "name": "Pandora",
      // "parameters": '{"target": "https://tv.pandora.com/?model=Hyatt_House&vendor=World_Cinema&type=HTML5&modelYear=2016&badge=x65degejwsy6bkrt4ld5wdbp6cukej2z3dc7zum42hmcdjghaajq&pauseKey=19&playKey=415&skipKey=417&previousKey=412&backKey=461"}',
      "parameters": JSON.stringify({
         params:{
            "target": "https://tv.pandora.com/?model=Hyatt_House&vendor=World_Cinema&type=HTML5&modelYear=2016&badge=x65degejwsy6bkrt4ld5wdbp6cukej2z3dc7zum42hmcdjghaajq&pauseKey=19&playKey=415&skipKey=417&previousKey=412&backKey=461"
         }
      }),
      "desc": "Discover and watch your favorite videos and channels on YouTube.\n\nFrom comedy to music to sports, find the channels you love. Watching a video is just the beginning when you can like, share, comment, and more. By signing in to YouTube, you can easily access your subscribed channels, playlists, and more.",
      'containerClass': "pandoraContainer",
      "image": pandoraImage
   },
   {
      "launch_id": "244115188075859015",
      "preloaded": true,
      "title": "Bluetooth Sound Sync",
      "name": "Bluetooth",
      "desc": "Enjoy audio from your mobile device through the TV's speakers",
      'containerClass': "bluetoothContainer",
      "image": bluetoothImage
   }
];

const AppsPage = (props)=>{
   const {appsPage: appsPageStyles} = useTheme();
   useGetShowtimeTokenQuery();
   // const [focusApp, setFocusApp] = useState(null)
   let myRef = useRef();
   useEffect(()=>{
      if(props.transitionState === 'entering'){
         anime({
            targets:myRef.current,
            opacity:1,
            duration:500,
            easing: 'easeInExpo',
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
   const showtimeToken = useSelector((state)=>{
      return state.root.showtimeToken;
   });
   const roomNumber = useSelector((state)=>{
      return state.hcap.property.room_number;
   })
   const showtimeParameters =  `{'propertyToken': '${showtimeToken}','deviceLocationId':'${Hasher.generateShowtimeHash(roomNumber ? roomNumber : '')}'}`;
   console.log(applist)
   return <div css={appsPageStyles.appsPageContainer}>
         <RightPanel transitionState={props.transitionState}/>
         <div ref={myRef} css={appsPageStyles.appItemsSection}>
            {applist.map((app, index)=>{
               let app_params = {...app, containerStyle:appsPageStyles[app.containerClass]};
               if(app.name === "Showtime"){
                  app_params.parameters = showtimeParameters
               }
               return <AppNavItem key={app.name+"_"+index} app={app_params}/>
            })}
         </div>
   </div>
}

const AppInfo = (props)=>{
   const {appsPage: appsPageStyles} = useTheme();
   let app = useSelector((state)=>{
      if(state.applications.focusApp === null){
         return {
               "launch_id": "",
               "title": "Not Selected",
               "name": "Not Selected",
               "desc": "Initializing",
               'icon': null
            }
      }
      return state.applications.focusApp;
   }, shallowEqual)

   return <div css={appsPageStyles.infoContentContainer}>
      <div style={{padding:"50px 100px 50px 100px"}}>
         {app.image ? <img style={{'maxWidth':'100%'}} src={app.image} alt={app.name}/> : app.name}
      </div>
      <div style={{position:'absolute', 'top': 170, whiteSpace:'pre-wrap', fontSize:'20px', padding:"50px 100px 50px 100px"}}>
         {app.desc}
      </div>
   </div>
}

const AppInfoBackground = (props)=>{
   const {appsPage: appsPageStyles} = useTheme();
   return <div css={appsPageStyles.AppInfo}> </div>
}

const AppNavItem = (props)=>{
   const {appsPage: appsPageStyles} = useTheme();
   const dispatch = useDispatch()
   const onFocus = useCallback((app)=>{
      dispatch(setFocusApp(app));
   }, [dispatch])

   const onSelect = useCallback((app)=>{
      let params = {
         'id':app.launch_id,
         'name':app.name
      }
      if(app.parameters){
         params.parameters = app.parameters
      }
      if(app.preloaded){
         HcapPreloadedApplication.launchPreloadedApplication(params)
      }
      else {
         HcapApplication.launchApplication(params)
      }
   }, []);

   return <NavItem action={{'type': 'FUNC', 'func': onSelect.bind(this, props.app)}} onFocus={onFocus.bind(this, props.app)} css={appsPageStyles.appItemContainer} navkey={'nav_'+props.app.name}>
      <AppItem app={props.app}/>
   </NavItem>
}

const AppItem = (props)=>{
   const {appsPage: appsPageStyles} = useTheme();
   const selectedStyle = props.selected ? appsPageStyles.appSelected : null;
   console.log(props)
   let style = [appsPageStyles.appItemContent, props.app.containerStyle, selectedStyle] 
   return <div css={style}>
            <div style={{flex: '1 1 0', textAlign: 'center', 'padding': '29px', 'display': 'flex', flexDirection:'column', alignContent: 'center', 'justifyContent': 'center'}}>
               {props.app.image ? <img style={{'maxWidth': '100%'}} src={props.app.image} alt={props.app.name}/> : props.app.name}
            </div>
      </div>
}

const RightPanel = (props)=>{
   const {appsPage: appsPageStyles, mixins} = useTheme();
   const myRef = useRef()
   useEffect(()=>{
      if(props.transitionState === 'entering'){
         anime({
            targets:myRef.current,
            translateX:-960,
            duration:500,
            easing: 'easeInExpo',
         })
      }
      else if(props.transitionState === 'exiting'){
         anime({
            targets:myRef.current,
            translateX:960,
            duration:500,
            easing: 'easeOutExpo',
         })
      }
   })
   return <div ref={myRef} css={appsPageStyles.appsRightPanel}>
      <div css={[appsPageStyles.appsRightPanelBackgroundContainer, mixins.isolate]}>
         <div css={appsPageStyles.appsRightPanelBackgroundGradient}>
            <div css={appsPageStyles.appsRightPanelBackgroundImage}>
            </div>
         </div>
      </div>
     <AppInfo/>
      <div css={appsPageStyles.infoContentBackground}>

      </div>
   </div>
}
const DebugOverlay = (props)=>{
   let installedApps = useSelector((state)=>{
      return  state.applications.installedApps
   })

   return <div style={{'position':'absolute', 'top':'500px', 'left': '0px', 'zIndex':100, 'padding': '20px'}}>
      {installedApps.map((app, index)=>{
         return <div key={app.id} style={{display:'flex'}}>
            <div style={{marginRight: "10px"}}>ID: {app.id}</div>
            <div>title: {app.title}</div>
         </div>
      })}
   </div>
}

const SidePanelSvg = (props)=>{
   return  <svg  width="952px"
   height="1080px"
   viewBox="0 0 952 1080"
   version="1.1"
   id="svg5">
      <defs>
         <pattern id="img1" patternUnits='userSpaceOnUse' width="100%" height="100%">
            <image href={image} x="0" y="0"/>
         </pattern>
         <linearGradient
            id="linearGradient5381">
            <stop
               stopColor='#01172E'
               offset="0"
               id="stop5385" />
             <stop
               stopColor='#02203e'
               offset="0.34290028"
               id="stop5744" />
            <stop
               style={css`stop-color:#011324;stop-opacity:0.65882355`}
               offset="0.62535673"
               id="stop5874" />
            <stop
               style={css`stop-color:#000000;stop-opacity:0`}
               offset="1"
         id="stop5387" />
         </linearGradient>
    <linearGradient
       href="#linearGradient5381"
       id="linearGradient6708"
       gradientUnits="userSpaceOnUse"
       x1="-4.0825019"
       y1="387.83505"
       x2="1109.0721"
       y2="385.11343" />
      </defs>
      <g id="layer1">
         <path
            // style="stroke:#000000;stroke-width:1.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            stroke='none'
            strokeWidth='1px'
            strokeLinecap='butt'
            strokeLinejoin='miter'
            strokeOpacity={1}
            d="M 0,1080 500,0 H 950 V 1080 L 0,1080"
            id="path876"
            fill="url(#linearGradient6708)"
         />
         <path
            // style="stroke:#000000;stroke-width:1.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
            stroke='none'
            strokeWidth='1px'
            strokeLinecap='butt'
            strokeLinejoin='miter'
            strokeOpacity={1}
            style={{'mixBlendMode': "lighten"}}
            d="M 0,1080 500,0 H 950 V 1080 L 0,1080"
            id="path876"
            fill="url(#img1)"
            fillOpacity={0.2}
         />
      </g>
   </svg>
}

export default AppsPage;
