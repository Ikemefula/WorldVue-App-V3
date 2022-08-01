import hcap from './hcap';
import logger from '../logger';
class HcapSystem {
   beginDestroy(){}
   endDestroy(){}
   getBrowserDebugMode(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.system.getBrowserDebugMode({
            "onSuccess" : function(p) {
               logger.log("HcapSystem.getBrowseDebugMode: success| " + p.debugMode);
               resolve(p);
            },
            "onFailure" : function(f) {
               logger.log("HcapSystem.getBrowseDebugMode: fail| " + f.message);
               reject(f);
            }
         });
      });
      return hcapPromise;
   }
   setBrowserDebugMode(toggle){
      // Turns on or off the remote object inspector of the HCAP browser.
      // Changed setting will take affect after a reboot.
      // After a reboot, open the http://TV_IP:2345 on TV remote client (Chrome on PC).
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.system.setBrowserDebugMode({
            "debugMode" : toggle,
            "onSuccess" : function() {
               logger.log("HcapSystem.setBrowserDebugMode: success");
               resolve(true)
            },
            "onFailure" : function(f) {
               logger.log("HcapSystem.setBrowserDebugMode: fail|" + f.message);
               reject(f)
            }
         });
      });
      return hcapPromise;
   }
   getCpuUsage(){}
   getFocused(){}
   requestFocus(){}
   getMemoryUsage(){}
   setProcentricServer(){}
}

const hcapSystem = new HcapSystem();
export default hcapSystem