//src/features/guide/components/Guide.jsx
import {useEffect} from 'react';
import  {rowCount, timeSlots} from '../../../utils/GuideBuilder';
import {css, useTheme} from '@emotion/react'
import { shallowEqual, useSelector } from 'react-redux';
import channelIconIndex from "../../../styles/assets/icons/channel"
import TimeHelper from '../../../utils/timeHelper';
import dayjs from 'dayjs';
import ProgramItem from './ProgramItem';
import React from 'react';
import palette from '../../../styles/palettes/default';


const height =  501;
const headerHeight = 50;
const width =  1920;
const rowHeight = (height-headerHeight)/(rowCount-1);
const firstColWidth = 140;
const totalProgramWidth = width - firstColWidth;
const totalTimeRangeMs = TimeHelper.conversionsFactors.HOUR.MILLISECONDS * (timeSlots/2);
const rowHeightStyle = css`
   height: ${rowHeight}px;
`
const headerHeightStyle = css`
   height: ${headerHeight}px;
   background: 'rgba(1, 23, 46, 1)';
`
const rowFlex = css`
   display:flex;
   flex-grow:1;
`
const firstItem = css`
   min-width:${firstColWidth}px;
   max-width:${firstColWidth}px;
   border: none;
`

const Guide = (props)=>{
   const view = useSelector((state)=>{
      return state.guide.guideView
   })

   // const {firstChannel, startingTime} = useSelector((state)=>{
   //    if(state.guide.guideView.range.start !== undefined){

   //       return {
   //          startingChannel: state.guide.guideView.range.start,
   //          firstChannel: state.guide.guideView.channels[0].logicalChannel
   //       }
   //    }
   //    else{
   //       return{
   //          firstChannel:null,
   //          startingTime:null
   //       }
   //    }
   // }, shallowEqual)

   // useEffect(()=>{
   //    if(props.transitionState === 'entered'){
   //       console.log("Guide Entered")
   //    }
   //    else if(props.transitionState === 'entering'){
   //       console.log("Guide Entering")
   //    }
   //    else if(props.transitionState === 'exited'){
   //       console.log("Guide Exited")
   //    }
   //    else if(props.transitionState === 'exiting'){
   //       console.log("Guide Exiting")
   //    }
   // }, [props.transitionState])


   // useEffect(()=>{
   //    //view change detected
   //    console.log("ViewChange detected");
   //    // navigator.flow(true); //force a reflow of navigation
   // }, [firstChannel, startingTime])
   let {guidePage} = useTheme();

   if(Object.keys(view.programs).length > 0){
      console.log(dayjs(view.programs[view.channels[0].channelName][0].startTimestamp).format("ddd MM/DD"))
   }
   return <div css={guidePage.guideContainer}>
            <div css={[headerHeightStyle, rowFlex]}>
               <div css={[firstItem, guidePage.guideDayDate]}>
                  {Object.keys(view.programs).length ? dayjs(view.programs[view.channels[0].channelName][0].startTimestamp).format("ddd MM/DD"): null}
               </div>
               {view.times.map((item)=>(<div key={'chan_'+item} css={guidePage.guideTimeSlot}>{item}</div>))}
            </div>
            {view.channels.map((channel)=>{
               return <div key={'guide_chan_'+channel.channelName} css={[rowHeightStyle, rowFlex]}>
                  <div>
                  </div>
                  <div css={[guidePage.guideChannelName, firstItem]}>
                     <div>{channel.logicalChannel}</div>
                     <div css={guidePage.guideIconContainer}>
                        <img css={guidePage.guideIconImg} src={channelIconIndex[channel.channelName]} alt={channel.channelName}/>
                     </div>
                     <div>{channel.channelName}</div>
                  </div>
                  {view.programs[channel.channelName].map((program, index)=>{
                     let durationMs = 0;
                     if(program.startTimestamp < view.range.start  && program.endTimestamp > view.range.end){
                        //the program is longer than the current view range
                        durationMs = view.range.end - view.range.start
                     }
                     else if(index === 0){
                        //first one in the list
                        durationMs = program.endTimestamp - view.range.start
                     }
                     else if(index === view.programs[channel.channelName].length - 1){
                        //last one in the list
                        durationMs = view.range.end - program.startTimestamp
                     }
                     else {
                        durationMs = program.endTimestamp - program.startTimestamp
                     }
                     // console.log(`${channel.channelName} - ${index} - ${durationMs}`);
                     let basis = (durationMs/totalTimeRangeMs)*totalProgramWidth - 1
                     // console.log(basis);
                     return <ProgramItem key={'prog_'+program.id} css={[guidePage.guideProgramItem,css({'width': `${basis}px`})]} program={program} index={index}/>
                  })}
               </div>
            })}
         </div>
}


export default Guide