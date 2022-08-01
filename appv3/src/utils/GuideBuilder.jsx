//src/utils/GuideBuilder.jsx
import dayjs from 'dayjs';
import logger from './logger';
import {store} from '../app/store';
import {setCurrentView} from '../features/guide/GuideReducer';
import timeHelper from './timeHelper';
import { current } from 'immer';
export const rowCount = 5;
export const timeSlots = 6;
// export const height = 10;
// export const width = 10;

class GuideBuilder {

   static getNextView(startingLogicalChannel, startingTime, focusNavkey=null){
      //starting logical channel is what will be the first channel in the list
      //starting time is the time in the first time column as a millisecond integer timestamp
      //focus navkey allows us to specifiy what should be the first focus of the new view
      let t1 = performance.now()
      let {lineup, guideData} = store.getState().guide;
      let timesInView = [];
      let channelsInView = [];
      let firstIndex = getIndexFromLogical(startingLogicalChannel, lineup);
      let nextIndex = firstIndex;
      //                          - 1 on rowcount to account for header row for now... theres probably a better way to do this
      for(let i = 0; i < rowCount - 1; i++){
         //this creates the logical channel loop. IE: getting to the end puts you at the begining
         channelsInView.push(lineup[nextIndex]);
         nextIndex += 1;
         if(nextIndex > lineup.length - 1){
            //set nextIndex = 0
            nextIndex = 0
         }
      }

      let startingTimeDayjs = timeHelper.getNearest30MinuteInterval(dayjs(startingTime));
      for(let i = 0; i<timeSlots; i++){
         timesInView.push(startingTimeDayjs.clone().add(30*i, 'minutes').format('h:mm A'))
      }
      // timesInView.push(startingTimeDayjs.clone().add(30, 'minutes').format('h:mm A'))
      // timesInView.push(startingTimeDayjs.clone().add(60, 'minutes').format('h:mm A'))
      // timesInView.push(startingTimeDayjs.clone().add(90, 'minutes').format('h:mm A'))

      let programs = {}
      let startDateTime = startingTimeDayjs.valueOf()
      let endDateTime = startingTimeDayjs.clone().add(30*(timeSlots), 'minute').valueOf();
      for(let channel of channelsInView){
         if(!(channel.channelName in guideData)){
            programs[channel.channelName] = [{
               id:Math.random() * 1000000 + 1000000000,
               logicalChannel:channel.logicalChannel,
               description:"",
               title:channel.channelName,
               endTimestamp:endDateTime,
               startTimestamp:startDateTime,
               channelName:channel.channelName,
               navkey: channel.channelName+"_0",
               programRowIndex: 0
            }]
            continue
         }
         programs[channel.channelName] = GuideBuilder.findProgramsInRange(startDateTime, endDateTime, guideData[channel.channelName])
         //set navkeys
         for(let i=0;i<programs[channel.channelName].length;i++){
            let navkey = channel.channelName+"_"+i;
            if(navkey === focusNavkey) {
               programs[channel.channelName][i].firstFocus = true;
            }
            programs[channel.channelName][i].navkey = navkey
            programs[channel.channelName][i].programRowIndex = i
         }
      }

      let t2 = performance.now()
      logger.log(`setCurrentView timer: ${t2-t1}`);
      return {
         range: {
            'start': startDateTime,
            'end': endDateTime
         },
         times: timesInView,
         channels: channelsInView,
         programs: programs
      }
   }

   static setCurrentView(view){
      store.dispatch(setCurrentView(view));
   }

   static shiftView(direction, steps=1){
      //get current view state
      let guide = store.getState().guide;
      let {guideView, lineup} = guide
      let currentFocusedProgram = guideView.focusProgram;

      //init variables used in switch
      let now = timeHelper.getNearest30MinuteInterval(dayjs())
      let view = null;
      let focusPrograms = [];
      // let focusProgramsLength = null;
      switch(direction){
         case 'left':
            let newTime_backwards = dayjs(guideView.range.start).subtract((30 * steps)-1, 'minutes').valueOf();
            // console.log("Shifting " + dayjs(currentView.range.start).format("h:mm") + " to "  + dayjs(currentView.range.start).subtract((30 * steps)+1, 'minutes').format('h:mm'))
            //can not shift earlier than the present time
            if(now > newTime_backwards) {
               return false;
            }
            view = GuideBuilder.getNextView(guideView.channels[0].logicalChannel, newTime_backwards)
            focusPrograms = view.programs[currentFocusedProgram.channelName]
            focusPrograms[0].firstFocus = true;
            //determine which item shuold be in focus when new view is rerendered
            //in the case of left shift it should be the first item of the current focus row
            break;
         case 'right':
            let newTime_forwards= dayjs(guideView.range.start).add((30 * steps)+1, 'minutes').valueOf();
            // console.log("Shifting " + dayjs(currentView.range.start).format("h:mm") + " to "  + dayjs(currentView.range.start).add((30 * steps)+1, 'minutes').format('h:mm'))
            view = GuideBuilder.getNextView(guideView.channels[0].logicalChannel, newTime_forwards)
            //set focus. IN hte case of right it should be the last item of the current focus row
            focusPrograms = view.programs[currentFocusedProgram.channelName]
            focusPrograms[focusPrograms.length -1].firstFocus = true;
            break;
         case 'down':
            let nextLogicalChannelDown = GuideBuilder.getNextLogicalChannel(guideView.channels[0].logicalChannel, lineup, 'down', steps);
            view = GuideBuilder.getNextView(nextLogicalChannelDown, guideView.range.start);
            //set focus in the case of down it should be the same index on the next logical channel (or nearest index if there is less channels on the next row)
            focusPrograms = view.programs[view.channels[view.channels.length -1].channelName];
            if(currentFocusedProgram.programRowIndex >= focusPrograms.length){
               focusPrograms[focusPrograms.length -1].firstFocus = true;
            }
            else{
               focusPrograms[currentFocusedProgram.programRowIndex].firstFocus = true;
            }
            break;
         case 'up':
            let nextLogicalChannelUp = GuideBuilder.getNextLogicalChannel(guideView.channels[0].logicalChannel, lineup, 'up', steps);
            view = GuideBuilder.getNextView(nextLogicalChannelUp, guideView.range.start);
            //set focus in the case of down it should be the same index on the next logical channel (or nearest index if there is less channels on the next row)
            focusPrograms = view.programs[view.channels[0].channelName];
            if(currentFocusedProgram.programRowIndex >= focusPrograms.length){
               focusPrograms[focusPrograms.length -1].firstFocus = true;
            }
            else{
               focusPrograms[currentFocusedProgram.programRowIndex].firstFocus = true;
            }
            break;
         default:
            console.log("Invalid guide shift direction: " + direction);
      }
      if(view !== null){
         GuideBuilder.setCurrentView(view);
      }
      return true
   }

   static getNextLogicalChannel(logicalChannel, lineup, direction, steps=1){
      //steps allows you jump a certain number of channels. usefull for paging on the guide
      let currentIndex = getIndexFromLogical(logicalChannel, lineup);
      if(direction === 'down'){
         if(currentIndex + steps >= lineup.length){
            //reached the end. Go back to the first channel
            //The Math
            // 40 channel lineup. Max index 39 (length - 1)
            //we're at index 37
            // jump forward 5 steps
            // 37 -> 38, 39(length - 1), 0, 1, 2
            // (steps - ((length -1)- currentIndex)) -1
            // (5 - ((40 - 1) - 37)) -1
            // (5 - (39 - 37)) -1
            // (5 - 2) - 1
            //  3 -1 = 2*** final index
            let maxIndex = lineup.length - 1
            let nextIndex = (steps - (maxIndex - currentIndex)) - 1
            return lineup[nextIndex].logicalChannel
         }
         return lineup[currentIndex+steps].logicalChannel
      }
      else if(direction ==='up'){
         if(currentIndex - steps < 0){
            //reached the begining. Go to the last channel
            //The Math
            //40 channel lineup Max index 39 (length - 1)
            //we're at 2
            //jump backward 5 steps
            // 2 -> 1 , 0 , 39 , 38, 37
            // (length) - (steps - currentIndex)
            // 40 - (5 - 2)
            // 40 - 3 = 37
            let nextIndex = (lineup.length) - (steps - currentIndex);
            return lineup[nextIndex].logicalChannel
         }
         return lineup[currentIndex - steps].logicalChannel
      }
   }

   static findProgramsInRange(start, end, program_array){
      // console.log(`Finding programs in range ${dayjs(start).format('YYYY-MM-DD HH:mm:ss')} | ${dayjs(end).format('YYYY-MM-DD HH:mm:ss')} in array of length ${program_array.length}` )
      let programs = []
      for(let program of program_array){
         if(program.endTimestamp > start && program.startTimestamp < end){
            programs.push({...program})
         }
         else if(program.startTimestamp >= end){
            //we're beyond the view time range.
            break;
        }
      }
      return programs
   }

   static currentProgramForChannel(channelName, guideData){
      if(!channelName || !guideData){
         return null
      }
      if(!(channelName in guideData)){
         return {
            'title': channelName,
            'description': ''
         }
      }
      // let t1 = performance.now()
      let now = dayjs()
      let programs = guideData[channelName];
      let currentProgram = null;
      for(let program of programs){
         if(program.endTimestamp >= now.valueOf() && program.startTimestamp <= now.valueOf()){
            currentProgram = program
            break;
         }
         else if(program.startTimestamp >= now.valueOf()){
            break
        }
      }
      // let t2 = performance.now()
      // logger.log(`getCurrentProgram timer: ${t2-t1}`);
      return currentProgram
   }

   static getAllCurrentPrograms(){
      let {guideData} = store.getState().guide;
      let currentPrograms = {};
      for(let key in guideData){
         currentPrograms[key] = GuideBuilder.currentProgramForChannel(key);
      }
   }

   static getIndexFromLogical = (logical)=>{
      let {lineup} = store.getState().guide;
      for(let i = 0; i < lineup.length; i++){
         if(lineup[i].logicalChannel === logical) return i
      }
      return null
   }

}

const getIndexFromLogical = (logical, lineup)=>{
   for(let i = 0; i < lineup.length; i++){
      if(lineup[i].logicalChannel === logical) return i
   }
   return null
}

export default GuideBuilder