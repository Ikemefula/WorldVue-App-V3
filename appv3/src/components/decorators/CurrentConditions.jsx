import {useEffect, useRef} from 'react';
import anime from 'animejs' ;
import TimeDisplay from './TimeDisplay';
import TimeHelper from '../../utils/timeHelper';
const CurrentConditions = (props)=>{
   let thisRef = useRef()
   //this is not showing because the style puts it offscreen at first. Its supposed to transition on screen.
   //TODO: pass the container style as a prop for positioning purposes. Also test to see if
   return <div ref={thisRef} css={(theme)=>(theme.decorators.currentConditionsContainer)}>
            <div css={(theme)=>(theme.decorators.currentTemp)}>97&deg;F</div>
            <div css={(theme)=>(theme.decorators.verticalSeperator)}/>
            <div css={(theme)=>(theme.decorators.currentTimeDateContainer)}>
               <TimeDisplay css={(theme)=>(theme.decorators.currentTime)}>{TimeHelper.getFormattedTime()}</TimeDisplay>
               <div css={(theme)=>(theme.decorators.horizontalSeperator)}/>
               <div css={(theme)=>(theme.decorators.currentDate)}>{TimeHelper.getFormattedDate()}</div>
            </div>
          </div>
}

export default CurrentConditions