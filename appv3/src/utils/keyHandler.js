//src/utils/keyHandler.js
import HcapKey from './hcap/hcapKey';
import {navigator} from './navigator';
import channelManager from './ChannelManager';
import logger from './logger';
// import {history} from '../index';

const keycodes = HcapKey.keycodes

class KeyHandler {
   constructor(){
      this.history = null;
      this.numberKeyBuffer = '';
      this.defaultKeyMap = {
         'up': function(){
            navigator.move('up');
         },
         'down': function(){
            navigator.move('down');
         },
         'left': function(){
            navigator.move('left');
         },
         'right': function(){
            navigator.move('right');
         },
         'enter': function(){
            navigator.select()   
         },
         'menu': function(){
            this.history.push("/");
         }.bind(this),
         'guide': function(){
            this.history.push("/guide");
         }.bind(this),
         'apps': function(){
            this.history.push("/applications");
         }.bind(this),
         'info': undefined,
         'netflix': undefined,
         'back': function(){
            this.history.goBack()
         }.bind(this),
         'exit': function(){
            this.history.push("/")
         }.bind(this),
         'last': undefined,
         'chup': undefined,
         'chdown': undefined,
         'vup': undefined,
         'vdown': undefined,
         'mute': undefined,
         'green': undefined,
         'yellow': undefined,
         'blue': undefined,
         'red': undefined,
         'zero' : ()=>{channelManager.directTune(0)},
         'one'  : ()=>{channelManager.directTune(1)},
         'two'  : ()=>{channelManager.directTune(2)},
         'three': ()=>{channelManager.directTune(3)},
         'four' : ()=>{channelManager.directTune(4)},
         'five' : ()=>{channelManager.directTune(5)},
         'six'  : ()=>{channelManager.directTune(6)},
         'seven': ()=>{channelManager.directTune(7)},
         'eight': ()=>{channelManager.directTune(8)},
         'nine' : ()=>{channelManager.directTune(9)}
      }

      this.keyMap = {
         'up': undefined,
         'down': undefined,
         'left': undefined,
         'right': undefined,
         'enter': undefined,
         'menu': undefined,
         'guide': undefined,
         'apps': undefined,
         'info': undefined,
         'netflix': undefined,
         'back': undefined,
         'exit': undefined,
         'last': undefined,
         'chup': undefined,
         'chdown': undefined,
         'vup': undefined,
         'vdown': undefined,
         'mute': undefined,
         'yellow': undefined,
         'blue': undefined,
         'red': undefined,
         'zero': undefined,
         'one': undefined,
         'two': undefined,
         'three': undefined,
         'four': undefined,
         'five': undefined,
         'six': undefined,
         'seven': undefined,
         'eight': undefined,
         'nine': undefined
      }
      this.logKeyPresses = true;
      this.xref = {
         //dev keyboard
         [keycodes.K_BACK]: 'back',
         [keycodes.K_EXIT]: 'exit',
         [keycodes.K_RED]: 'red',
         [keycodes.K_GREEN]: 'green',
         [keycodes.K_YELLOW]: 'yellow',
         [keycodes.K_BLUE]: 'blue',
         [keycodes.K_LAST]: 'last',
         [keycodes.K_VOL_UP]: 'vup',
         [keycodes.K_VOL_DOWN]: 'vdown',
         [keycodes.K_CH_UP]: 'chup',
         [keycodes.K_CH_DOWN]: 'chdown',
         [keycodes.K_MUTE]: 'mute',
         [keycodes.K_ON_DEMAND]: 'netflix',
         [keycodes.K_PORTAL]: 'menu',
         [keycodes.K_APPS]: 'apps',
         [keycodes.K_INFO]: 'info',
         [keycodes.K_GUIDE]: 'guide',
         //remote hcap key codes
         [keycodes.NUM_0]:'zero',
         [keycodes.NUM_1]:'one',
         [keycodes.NUM_2]:'two',
         [keycodes.NUM_3]:'three',
         [keycodes.NUM_4]:'four',
         [keycodes.NUM_5]:'five',
         [keycodes.NUM_6]:'six',
         [keycodes.NUM_7]:'seven',
         [keycodes.NUM_8]:'eight',
         [keycodes.NUM_9]:'nine,',
         [keycodes.GUIDE]: 'guide',
         [keycodes.INFO]: 'info',
         [keycodes.LEFT]: 'left',
         [keycodes.UP]: 'up',
         [keycodes.RIGHT]: 'right',
         [keycodes.DOWN]: 'down',
         [keycodes.ENTER]: 'enter',
         [keycodes.BACK]: 'back',
         [keycodes.EXIT]: 'exit',
         [keycodes.RED]: 'red',
         [keycodes.GREEN]: 'green',
         [keycodes.YELLOW]: 'yellow',
         [keycodes.BLUE]: 'blue',
         [keycodes.POWER]: 'power',
         [keycodes.VOL_UP]: 'vup',
         [keycodes.VOL_DOWN]: 'vdown',
         [keycodes.MUTE]: 'mute',
         [keycodes.ON_DEMAND]: 'netflix',
         [keycodes.APPS]: 'apps',
         [keycodes.PORTAL]: 'menu',
         [keycodes.CH_UP]: 'chup',
         [keycodes.CH_DOWN]: 'chdown',
         [keycodes.LAST5500]: 'last',
         [keycodes.FLASHBK]: 'last'
      }
      this.keyMap = {...this.defaultKeyMap};
   }

   async registerCustomKeys(){
      //add our customer keys to hcap
      //going backwards from platform 2 causes this button not to function. This will re-enable the input button on the remote
      await HcapKey.addKeyItem(0x00000000, keycodes.INPUT, 0);

      // Register keys with the STB so we can receive keydown events on them.
      // For custom IR codes to work and see them PTC LOGGING you need to first register the power key
      // with the first 4 bytes of the key. in marriotts' case 03fc
      await HcapKey.addKeyItem(0x03fc00ff, keycodes.POWER, 2);
      await HcapKey.addKeyItem(0x03fc639c, keycodes.RES_5, 2);
      await HcapKey.addKeyItem(0x03fc649b, keycodes.RES_6, 2);

      // wci key group id is d32c
      await HcapKey.addKeyItem(0xd32c00ff, keycodes.POWER, 2);
      await HcapKey.addKeyItem(0xd32c02fd, keycodes.APPS, 2);
      await HcapKey.addKeyItem(0xd32c01fe, keycodes.ON_DEMAND, 2);
   }

   setHistory(history){
      this.history = history;
   }

   setKeyMap(map){
      this.keyMap = {...this.keyMap, ...map};
   }

   setKeyFunction(key, func){
      this.keyMap[key] = func;
   }

   resetKeyMap(){
      this.keyMap = this.defaultKeyMap;
   }

   handleKeyPress(keycode){
      let key = undefined;
      if(this.xref[keycode] !== undefined){
         key = this.xref[keycode];
      }
      else {
         logger.log('Key Press: ' + keycode +' = xref not defined');
      }
      if(this.logKeyPresses){
         logger.log('Key Press: ' + keycode +' = ' + key);
      }
      if(key === undefined){
         return;
      }
      if(this.keyMap[key] === undefined){
         console.log(key + " has no defined function");
      }
      this.keyMap[key]();//execute key function
   }

}

const keyHandler = new KeyHandler();
export default keyHandler
