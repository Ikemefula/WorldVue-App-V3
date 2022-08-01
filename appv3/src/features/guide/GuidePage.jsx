import React, {useEffect, useRef} from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import keyHandler from '../../utils/keyHandler';
import {navigator} from '../../utils/navigator';
import Guide from './components/Guide';
import anime from 'animejs';
import GuideBuilder, {rowCount} from '../../utils/GuideBuilder';
import TimeHelper from '../../utils/timeHelper';
import { useTheme } from '@emotion/react';
const GuidePage = (props)=>{
   const {guidePage} = useTheme();
   const containerRef = useRef();
   useEffect(()=>{
      //calculate navigation data structure on mount
      if(props.transitionState === 'entered'){
         navigator.flow(true)
      }
      else if(props.transitionState === 'entering'){
         // animateBottomIn(containerRef.current)
      }
      else if(props.transitionState === 'exiting'){
         // animateBottomOut(containerRef.current)
      }
   },[props.transitionState])

   useEffect(()=>{
      keyHandler.setKeyMap({
         'chup': async ()=>{
            await GuideBuilder.shiftView('up', rowCount - 1) //-1 to account for times row.
         },
         'chdown': async ()=>{
            await GuideBuilder.shiftView('down', rowCount - 1)
         },
      })
   }, [])

   return <div ref={containerRef} css={guidePage.guideMainContainer}>
         <GuideSection transitionState={props.transitionState}/>
         <ProgramInformation transitionState={props.transitionState}/>
      </div>
}


const animateProgramInformationIn = (el)=>{
   anime({
      targets:el,
      translateX:960,
      duration:500,
      easing: 'easeOutExpo'
   })
}

const animateProgramInformationOut=(el)=>{
   anime({
      targets:el,
      translateX:-960,
      duration:500,
      easing: 'easeInExpo'
   })
}


const ProgramInformation = (props)=>{
   const {guidePage, mixins} = useTheme();
   const containerRef = useRef();
   const programInfo = useSelector((state)=>{
      return state.guide.guideView.focusProgram;
   }, shallowEqual)

   useEffect(()=>{
      if(props.transitionState === 'entered'){
         navigator.flow(true)
      }
      else if(props.transitionState === 'entering'){
         animateProgramInformationIn(containerRef.current)
      }
      else if(props.transitionState === 'exiting'){
         animateProgramInformationOut(containerRef.current)
      }
   })

   return <div ref={containerRef} css={guidePage.programInformationContainer}>
            <div css={mixins.isolate}>
               <div css={guidePage.programInforamtionBackgroundImage}>
               </div>
               <div css={guidePage.programInforamtionBackground}>
               </div>
            </div>
            <div css={guidePage.programInfoContainer}>
               <div css={guidePage.programInfoContent}>
                  <div css={guidePage.programTitle}>{programInfo? programInfo.title : null}</div>
                  <div css={guidePage.programLogicalName}>
                     <div>{programInfo ?
                        programInfo.logicalChannel + " - " + programInfo.channelName
                     : null}</div>
                  </div>
                  <div css={guidePage.programTimeSlot}>
                     {programInfo ?
                        TimeHelper.getFormattedTime(programInfo.startTimestamp) + " - " +  TimeHelper.getFormattedTime(programInfo.endTimestamp) : null}
                  </div>
                  <div css={guidePage.programDescription}>
                  {programInfo ? (!programInfo.description? 'No Description': programInfo.description ) : null }
                  </div>
               </div>
            </div>
         </div>
}


// const Divider = ()=>{
//    return <div className='guideDivider'>

//    </div>
// }


const animateBottomIn = (el)=>{
   anime({
      targets:el,
      translateY:-500,
      duration:500,
      easing: 'easeOutExpo'
   })
}

const animateBottomOut=(el)=>{
   anime({
      targets:el,
      translateY:1080,
      duration:500,
      easing: 'easeInExpo'
   })
}

const GuideSection = (props)=>{
   let containerRef = useRef();
   let {guidePage} = useTheme();
   useEffect(()=>{
      if(props.transitionState === 'entered'){
         navigator.flow(true)
      }
      else if(props.transitionState === 'entering'){
         animateBottomIn(containerRef.current)
      }
      else if(props.transitionState === 'exiting'){
         animateBottomOut(containerRef.current)
      }
   })
   return <div ref={containerRef} css={guidePage.guideGridContainer}>
      <Guide/>
   </div>
}

export default GuidePage