import {useRef, useState, useEffect, useCallback} from 'react';
import { shallowEqual, useSelector } from "react-redux";
import channelIconIndex from "../styles/assets/icons/channel";
import GuideBuilder from "../utils/GuideBuilder";
import animejs from 'animejs';
import keyHandler from '../utils/keyHandler';
import logo from '../styles/assets/images/worldvue-logo-white-blue.png';
import TimeHelper from '../utils/timeHelper';
import { useTheme } from '@emotion/react';
const _BANNER_DEBUG_FLAG = true; //set this to true to freeze the banner in place
var bannerVisibleDelay = null;

const ChannelBanner = (props)=>{
   const {channelBanner: channelBannerStyles} = useTheme();
   const [visible, setVisible] = useState(false);
   const bannerRef = useRef();
   let logicalChannel = 2;
   if(props.channel !== undefined){
      logicalChannel = props.channel.logicalChannel;
   }
   const program = useSelector((state)=>{
      let currentProgram = GuideBuilder.currentProgramForChannel(props.channel.channelName, state.guide.guideData);
      if(currentProgram === null){
         return {
            'title':"",
            'description': ""
         }
      }
      return {
         'title': currentProgram.title,
         'description':currentProgram.description,
         'channelName':currentProgram.channelName,
         'timeSlot': TimeHelper.getFormattedTime(currentProgram.startTimestamp) + " - " +  TimeHelper.getFormattedTime(currentProgram.endTimestamp)
      }
   }, shallowEqual)
   const showBanner = useCallback(()=>{
      if(!visible){
        setVisible(true);
         animejs({
            targets:bannerRef.current,
            translateY:-300,
            duration:500,
            easing: 'easeOutExpo',
         })
      }
      if(!_BANNER_DEBUG_FLAG){
         if(bannerVisibleDelay !== null){
            clearTimeout(bannerVisibleDelay)
            bannerVisibleDelay = null;
         }
         bannerVisibleDelay = setTimeout(()=>{
            setVisible(false)
            animejs({
               targets:bannerRef.current,
               translateY:300,
               duration:500,
               easing: 'easeInExpo',
            })
         }, 3000)
      }
   }, [bannerRef, logicalChannel, setVisible])
   useEffect(()=>{
      keyHandler.resetKeyMap();
      keyHandler.setKeyMap({
         'info': ()=>{
            console.log("Showing banner")
            showBanner()
         }
      })
      return ()=>{
         keyHandler.setKeyMap({
            'info':undefined
         })
      }
   }, [])

   useEffect(()=>{
      showBanner();
   }, [logicalChannel])
   return <div ref={bannerRef} css={channelBannerStyles.channelBannerRootContainer}>
            <div css={channelBannerStyles.channelBannerContentContainer}>
               <div css={channelBannerStyles.channelBannerInfoContainer}>
                  <div css={channelBannerStyles.channelBannerInfoOverlay}>
                     <div css={channelBannerStyles.channelBannerLogicalChannel}>
                        {logicalChannel}
                     </div>
                     <div css={channelBannerStyles.channelBannerChannelIconContainer}>
                        <img css={channelBannerStyles.channelBannerChannelIcon} src={channelIconIndex[program.channelName]} alt={program.channelName}/>
                     </div>
                     <div css={channelBannerStyles.channelBannerBrandLogoContainer}>
                        <img css={channelBannerStyles.channelBannerBrandLogo} src={logo} alt='LOGO'/>
                     </div>
                  </div>
               </div>
               <div css={channelBannerStyles.channelBannerDescriptionContainer}>
                  <div>
                     <div css={channelBannerStyles.channelBannerProgramName}>{program.title}</div>
                     <div css={channelBannerStyles.channelBannerProgramDescription}>{program.description}</div>
                     <div css={channelBannerStyles.channelBannerProgramTimeSlot}>{program.timeSlot}</div>
                  </div>
                  <div>
                  </div>
               </div>
            </div>
         </div>
}

export default ChannelBanner