import hcap from './hcap.js';
import {store} from '../../app/store';
import {networkRefresh} from './hcapReducer';

class HcapNetwork {

   ping(){

   }

   getWifiDiagnostics(){

   }

   getNumberOfNetworkDevices(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.network.getNumberOfNetworkDevices({
            "onSuccess" : function(s) {
               console.log(`HcapNetwork.getNumberOfNetworkDevices: success| ${s.count}`);
               resolve(s);
            },
            "onFailure" : function(f) {
               console.log(`HcapNetwork.getNumberOfNetworkDevices: fail`);
               reject(f);
           }
         });
      });
      return hcapPromise;
   }

   getNetworkDevice(index){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.network.getNetworkDevice({
            'index': index,
            "onSuccess" : function(s) {
               console.log(`HcapNetwork.getNetworkDevice: success`);
               resolve(s);
            },
            "onFailure" : function(f) {
               console.log(`HcapNetwork.getNetoworkDevice: fail`);
               reject(f);
           }
         });
      });
      return hcapPromise;
   }

   getNetworkInformation(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.network.getNetworkInformation({
            "onSuccess" : function(s) {
               console.log(`HcapNetwork.getNetworkInformation: success`);
               resolve(s);
            },
            "onFailure" : function(f) {
               console.log(`HcapNetwork.getNetworkInformation: fail`);
               reject(f);
           }
         });
      });
      return hcapPromise;
   }

   //implement later this might be helpfull for STAY APT type chromecast setups
   // getSoftAP(){

   // }

   // setSoftAP(){

   // }

   //non-native hcap functions
   async refreshNetworkInformation(){
      //then get number of network devices
      let networkDevices = [];
      let {count} = await this.getNumberOfNetworkDevices();
      console.log(`Network device count ${count}`);
      let networkInformation = await this.getNetworkInformation();
      networkInformation.mac = null;
      for(let i=0; i < count; i++){
         let device = await this.getNetworkDevice(i);

         let {command_id, result, command, ...deviceInfo} = device;
         networkDevices.push(deviceInfo);
         if(device.ip === networkInformation.ip_address){
            networkInformation.mac = device.mac;
         }
      }

      let result = {
         networkInformation: networkInformation,
         networkDevices: networkDevices
      }

      //refresh redux state
      store.dispatch(networkRefresh(result))
      return result
   }

}

const hcapNetwork = new HcapNetwork();
export default hcapNetwork;