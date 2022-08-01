import hcap from './hcap.js';
import {store} from '../../app/store';
import {setCurrentChannel} from './hcapReducer';
import logger from '../logger'
class HcapChannel {

   getChannelMap(){
      //STB-6500 only
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.channel.getChannelMap({
            "onSuccess" : function(s) {
                console.log("HcapChannel.getChannelMap: success| map length= " + s.list.length );
                resolve(s);
            },
            "onFailure" : function(f) {
                console.log("HcapChannel.getChannelMap: fail| " + f.errorMessage);
                reject(f)
            }
         });
      });
      return hcapPromise
   }

   getChannelSignalStatus(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.channel.getChannelSignalStatus({
            "onSuccess" : function(s) {
               console.log("HcapChannel.getChannelSignalStatus: success");
               resolve(s);
            },
            "onFailure" : function(f) {
               console.log("HcapChannel.getChannelSignalStatus: fail| " + f.errorMessage);
               reject(f)
            }
         });
      });
      return hcapPromise
   }

   getCurrentChannel(){
      logger.log("Getting current channel");
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.channel.getCurrentChannel({
            "onSuccess" : function(s) {
               logger.log(`HcapChannel.getCurrentChannel: success| logical - ${s.logicalNumber} | status - ${s.channelStatus}`);
               store.dispatch(setCurrentChannel(s));
               resolve(s);
            },
            "onFailure" : function(f) {
               logger.log("HcapChannel.getCurrentChannel: fail| " + f.errorMessage);
               reject(f)
            }
         });
      });
      return hcapPromise
   }

   requestChangeCurrentChannel(params){
      logger.log("Requesting Channel Change " + JSON.stringify(params))
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.channel.requestChangeCurrentChannel({
            ...params,
            "onSuccess" : function() {
               logger.log("HcapChannel.requestChangeCurrentChannel: success");
               resolve(true)
            },
            "onFailure" : function(f) {
               logger.log("HcapChannel.requestChangeCurrentChannel: fail| " + f.message);
               reject(f);
            }
         });
      })
      return hcapPromise;
   }

   async changeChannelRFClass1(logical){
      console.log("Class 1 RF channel tune");
      try{
         if(logical === null ||  logical === undefined) return;
         await this.requestChangeCurrentChannel({
            'channelType': hcap.channel.ChannelType.RF,
            'logicalNumber': logical,
            'rfBroadcastType': hcap.channel.RfBroadcastType.CABLE
         });
      }
      catch(err){
         console.log("Class 1 RF Tune failed");
         console.log(err)
      }
   }

   async changeChannelRFClass3(major, minor){
      console.log("Class 3 RF channel tune");
      try{
         await this.requestChangeCurrentChannel({
            'channelType': hcap.channel.ChannelType.RF,
            'majorNumber': major,
            'minorNumber': minor,
            'rfBroadcastType': hcap.channel.RfBroadcastType.CABLE
         });
      }
      catch(err){
         console.log("Class 3 RF Tune failed");
         console.log(err);
      }
   }
   async changeChannelIPClass1(logical){
      console.log("Class 1 IP channel tune");
      try{
         if(logical === null ||  logical === undefined) return;
         await this.requestChangeCurrentChannel({
            'channelType': hcap.channel.ChannelType.IP,
            'logicalNumber': logical,
            "ipBroadcastType": hcap.channel.IpBroadcastType.UDP,
         });
      }
      catch(err){
         console.log("Class 1 IP tune failed");
         console.log(err);
      }
   }
   async changeChannelIPClass2(multicast_ip, port){
      console.log("Class 2 IP channel tune");
      try{
         await this.requestChangeCurrentChannel({
            'channelType': hcap.channel.ChannelType.IP,
            'ip': multicast_ip,
            'port': port,
            "ipBroadcastType": hcap.channel.IpBroadcastType.UDP,
         });
      }
      catch(err){
         console.log("Class 2 IP tune failed");
         console.log(err);
      }
   }
}

let hcapChannel = new HcapChannel();
export default hcapChannel;