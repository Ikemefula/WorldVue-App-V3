import hcap from './hcap'
class HcapMode {

   constructor(){
      this.mode = {
         HCAP_MODE_0:hcap.mode.HCAP_MODE_0,
         HCAP_MODE_1:hcap.mode.HCAP_MODE_1,
         HCAP_MODE_2:hcap.mode.HCAP_MODE_2,
         HCAP_MODE_3:hcap.mode.HCAP_MODE_3,
         HCAP_MODE_4:hcap.mode.HCAP_MODE_4
      }
   }

   getHcapMode(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.mode.getHcapMode({
            "onSuccess" : function(s) {
               console.log("HcapMode.getHcapMode: success|" + s.mode);
               resolve(s)
           },
           "onFailure" : function(f) {
               console.log("HcapMode.getHcapMode: fail|" + f.errorMessage);
               reject(f)
           }
         })
      });

      return hcapPromise
   }

   setHcapMode(mode){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.mode.setHcapMode({
            "mode":mode,
            "onSuccess" : function() {
               console.log("HcapMode.getHcapMode: success");
               resolve(true)
           },
           "onFailure" : function(f) {
               console.log("HcapMode.getHcapMode: fail|" + f.errorMessage);
               reject(f)
           }
         })
      });

      return hcapPromise
   }

}

const hcapMode = new HcapMode();
export default hcapMode;