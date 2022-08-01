import React, { useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import {navigator} from '../utils/navigator';
import keyHandler from '../utils/keyHandler';
import channelManager from '../utils/ChannelManager';
import logger from '../utils/logger'
import ChannelBanner from '../components/ChannelBanner';
const FullTVPage = (props)=>{
   let activeChannel = useSelector((state)=>{
      return state.guide.activeChannel
   },shallowEqual)

   useEffect(()=>{
      navigator.flow();
      logger.log("Setting /tv keymap")
      keyHandler.setKeyMap({
         'chup': async ()=>{
            channelManager.channelUp()
         },
         'chdown': async ()=>{
            channelManager.channelDown()
         }
      });
   },[]);
   return <div style={{height: '1080px', 'width': '1920px'}}>
      <DirectTuneDisplay/>
      <ChannelBanner channel={activeChannel}/>
   </div>
}

const DirectTuneDisplay = ()=>{
   let directTuneBuffer = useSelector((state)=>{
      return state.guide.directTuneBuffer
   });
   if(!directTuneBuffer){
      return null
   }
   return <div className='directTuneDisplay'>{directTuneBuffer}</div>
}

export default FullTVPage;
