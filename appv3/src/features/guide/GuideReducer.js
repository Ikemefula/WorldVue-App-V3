//src/features/guide/GuideReducer.js
import {createSlice} from '@reduxjs/toolkit';
import {localapi} from '../../app/api/local';
import logger from '../../utils/logger';
import dayjs from 'dayjs'
import timeHelper from '../../utils/timeHelper';

const guide = createSlice({
   name: 'guide',
   initialState: {
      'lineupInitialized': false,
      'guideDataInitialized': false,
      'maxGuideTime': null,
      'lineup': [],
      'guideData':{},
      'activeChannel': {},
      //this is the final result once we've inserted apps and other items to display in the guide. Used to build the guide
      'guideList': [],
      'directTuneBuffer': '',
      'logicalToIndexMap': {},
      'guideView': {
         range: {

         },
         times: [],
         channels: [],
         programs: [], 
         focusProgram: null
      }
   },
   reducers: {
      updateTuneBuffer:(state , {payload})=>{
         state.directTuneBuffer = payload;
      },
      setActiveChannel: (state, {payload})=>{
         //payload is logical channel number
         if(state.lineup.length > 0){
            state.lineupInitialized = true
            if(state.lineup[state.logicalToIndexMap[payload]] === undefined){
               logger.log("Logical " + payload + " not found in map")
            }
            else{
               state.activeChannel = state.lineup[state.logicalToIndexMap[payload]]
            }
         }
      },
      setNextChannel: (state, {payload})=>{
         //payload {direction: -1 | 1 }
         if(!state.lineupInitialized){
            logger.log("GuideReducer.setNextChannel: lineup not initilized");
            return
         }
         logger.log("setNextChannel: " + payload.direction);
         let {direction} = payload
         let currentActiveIndex = state.logicalToIndexMap[state.activeChannel.logicalChannel]
         if(direction === -1){
            //channel down
            //check if first channel
            if(currentActiveIndex <= 0){
               //wrap around to last channel
               state.activeChannel = state.lineup[state.lineup.length - 1];
            }
            else {
               state.activeChannel = state.lineup[currentActiveIndex  - 1];
            }
         }
         else if(direction === 1){
            if(currentActiveIndex >= state.lineup.length - 1){
               //wrap around to first channel
               state.activeChannel = state.lineup[0];
            }
            else {
               state.activeChannel = state.lineup[currentActiveIndex  + 1];
            }
         }
         else {
            console.log("Invalid direction")
         }
      },
      setCurrentView:(state, {payload})=>{
         state.guideView = payload
      },
      setFocusedProgram:(state, {payload})=>{
         state.guideView.focusProgram = payload
      }

   },
   extraReducers: (builder)=>{
      builder.addMatcher(localapi.endpoints.channelLineup.matchFulfilled, (state, {payload})=>{
         for(let i = 0; i<payload.length; i++){
            //ensure number type logical channels
            let logicalNumber = parseInt(payload[i].logicalChannel)
            state.logicalToIndexMap[logicalNumber] = i
            if(payload[i].startChannel){
               state.activeChannel = payload[i]
            }
         }
         state.lineup = payload;
      });
      builder.addMatcher(localapi.endpoints.guideData.matchFulfilled, (state, {payload})=>{
         state.guideDataInitialized = true
         //calculate start and end date timestamps
         let t1 = performance.now()
         let minimumTime = timeHelper.getNearest30MinuteInterval();
         let total = 0
         let guideData ={};
         let maxGuideTime = 0;
         let id = 0
         //TODO: invesitage if this can be preproccessed in processGuideData.py
         //      This would significantly speed up the startup process. 
         for(let key in payload){
            total += payload[key].length;
            if(!(key in guideData)){
               guideData[key] = []
            }
            for(let program of payload[key]){
               let startDateTime = dayjs(program.startDate+program.startTime, 'YYYMMDDHHmm').valueOf();
               let endDateTime = dayjs(program.endDate+program.endTime, 'YYYMMDDHHmm').valueOf();
               if(endDateTime < minimumTime.valueOf() || startDateTime > minimumTime.add(3, 'day').valueOf()){
                  continue
               }
               if(startDateTime > maxGuideTime){
                  maxGuideTime = startDateTime;
               }
               guideData[key].push({
                  'id': id,
                  'logicalChannel': program.logicalChannel,
                  'description': decodeHtml(program.description),
                  'title': decodeHtml(program.title),
                  'endTimestamp': endDateTime,
                  'startTimestamp': startDateTime,
                  'channelName': program.channelName
               });
               id++;
            }
         }
         let afterCount = 0
         for(let key in guideData){
            afterCount += guideData[key].length
         }
         console.log("Total guideData.json Progams: " + total)
         console.log("After filter count: " + afterCount);
         state.maxGuideTime = maxGuideTime
         state.guideData = guideData
         let t2 = performance.now()
         logger.log(`Guide Data Initializer timer: ${t2-t1}`);
      });
   }
});


const decodeHtml= (html)=> {
   var txt = document.createElement("textarea");
   txt.innerHTML = html;
   return txt.value;
}

export const {
   setActiveChannel,
   setNextChannel,
   updateTuneBuffer,
   setCurrentView,
   setFocusedProgram
} = guide.actions;

export default guide;