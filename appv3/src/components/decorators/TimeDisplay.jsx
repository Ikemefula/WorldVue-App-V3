import React, {useState, useEffect} from 'react';
import TimeHelper from '../../utils/timeHelper';

const TimeDisplay = (props)=>{
   let [currentTime, setCurrentTime] = useState(TimeHelper.getFormattedTime())

   useEffect(()=>{
      //set interval on mount
      const timeTickInterval = setInterval(()=>{
         setCurrentTime(TimeHelper.getFormattedTime());
      }, 1000)
      return ()=>{
         clearInterval(timeTickInterval)
      }
   }, [setCurrentTime])

   // useEffect(()=>{
   //    //remove interval on unmount
   // }, [])

   return <div className={props.className}>{currentTime}</div>
}

export default TimeDisplay