//src/utils/hcap/hcapPower.js
import hcap from './hcap'
import {store} from '../../app/store';
import {setPower} from './hcapReducer';
class HcapPower {

   constructor(){
      this.powerMode = hcap.power.PowerMode
      this.powerModeString = {
         1: 'NORMAL',
         2: 'WARM'
      }
   }

   getPowerMode(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.power.getPowerMode({
            'onSuccess': function(s){
               console.log("HcapPower.getPowerMode: "  + this.powerModeString[s.mode]);
               this.updateState('mode', s.mode);
               resolve(s.mode);
            }.bind(this),
            'onFailure': function(f){
               console.log("HcapPower.getPowerMode: fail| " + f.message);
               reject(f);
            }
         })
      });
      return hcapPromise
   }

   isWarmUpdate(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.power.isWarmUpdate({
            "onSuccess":function(s){
               console.log("HcapPower.isWarmUpdate: " + s.isWarmUpdate)
               resolve(s);
            },
            "onFailure": function(f){
               console.log("HcapPower.isWarmUpdate: fail")
               reject(f);
            }
         })
      });
      return hcapPromise
   }

   powerOff(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.power.powerOff({
            "onSuccess":function(s){
               console.log("HcapPower.powerOff: success")
               resolve(true);
            },
            "onFailure": function(f){
               console.log("HcapPower.powerOff: fail")
               reject(f);
            }
         })
      });
      return hcapPromise
   }

   reboot(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.power.reboot({
            "onSuccess":function(s){
               console.log("HcapPower.reboot: success");
               resolve(true);
            },
            "onFailure": function(f){
               console.log("HcapPower.reboot: fail");
               reject(f);
            }
         })
      });
      return hcapPromise
   }

   setPowerMode(mode){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.power.setPowerMode({
            "mode":mode,
            "onSuccess":function(s){
               console.log('HcapPower.setPowerMode: success| ' + this.powerModeString[mode])
               resolve(true);
            },
            "onFailure": function(f){
               console.log('HcapPower.setPowerMode: fail| ' + this.powerModeString[mode])
               reject(f);
            }
         });
      });
      return hcapPromise
   }

   updateState(property, value){
      //set redux state
      store.dispatch(setPower({
         "property": property,
         "value":value
      }))
   }

}

const hcapPower = new HcapPower()
export default hcapPower