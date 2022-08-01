// manages all things channels
import {store} from '../app/store';
import {localapi} from '../app/api/local';
import hcapChannel from './hcap/hcapChannel';
import logger from '../utils/logger';
import { setActiveChannel, setNextChannel, updateTuneBuffer} from '../features/guide/GuideReducer';

class ChannelManager {
   constructor(){
      this.initialized = false;
      this.firstChannelNumber = null;
      this.lastChannelNumber = null;
      this.startChannel = null;
      this.tuneDelay = null; //used to debounce
      this.tuneDebounceMS = 100
      this.numberBuffer = '';
      this.directTuneDelay = null;
      this.lineup = [];
      this.TUNE_DIRECTION = {'DOWN':-1, "UP": 1}
   }

   async initializeGuideData(){
      logger.log("Initializing Guide Data");
      let result = await store.dispatch(localapi.endpoints.channelLineup.initiate());
      let lineup = result.data;
      await store.dispatch(localapi.endpoints.guideData.initiate());
      this.firstChannelNumber = parseInt(lineup[0].logicalChannel);
      this.lastChannelNumber = parseInt(lineup[lineup.length -1].logicalChannel);
      this.lineup = []
      this.initialized = true;
   }

   async channelUp(){
      if(!this.initialized) return;
      logger.log("Channeling Up")
      if(this.tuneDelay !== null){
         clearTimeout(this.tuneDelay)
         this.tuneDelay = null;
      }
      store.dispatch(setNextChannel({'direction':this.TUNE_DIRECTION.UP}))
      this.tuneDelay = setTimeout(()=>{
         let {activeChannel} = store.getState().guide;
         hcapChannel.changeChannelRFClass1(activeChannel.logicalChannel);
      }, this.tuneDebounceMS)
   }

   async channelDown(){
      if(!this.initialized) return;
      logger.log("Channeling Down")
      if(this.tuneDelay !== null){
         clearTimeout(this.tuneDelay)
         this.tuneDelay = null;
      }
      store.dispatch(setNextChannel({'direction':this.TUNE_DIRECTION.DOWN}));
      this.tuneDelay = setTimeout(()=>{
         let {activeChannel} = store.getState().guide;
         hcapChannel.changeChannelRFClass1(activeChannel.logicalChannel);
      }, this.tuneDebounceMS)
   }

   directTune(number){
      logger.log(`ChannelManager.DirectTune: ${this.numberBuffer} adding ` + number)
      if(this.directTuneDelay !== null){
         clearTimeout(this.directTuneDelay)
         this.directTuneDelay = null;
      }

      this.numberBuffer += number.toString();
      store.dispatch(updateTuneBuffer(this.numberBuffer))
      logger.log("Current Number Buffer: " + this.numberBuffer);
      this.directTuneDelay = setTimeout(()=>{
         let logicalNumber = parseInt(this.numberBuffer);
         logger.log("Direct tuning: " + logicalNumber)
         hcapChannel.changeChannelRFClass1(logicalNumber).then(()=>{
            store.dispatch(setActiveChannel(logicalNumber));
            this.numberBuffer = '';
            store.dispatch(updateTuneBuffer(''))
         });
      }, 2000);
   }

   applicationTune(channel) {

   }

}

let channelManager = new ChannelManager();
export default channelManager;