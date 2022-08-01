import hcap from './hcap'
class HcapExternalInput {

   constructor(){
      this.sourceType = {
         'TV': hcap.externalinput.ExternalInputType.TV,
         'COMPOSITE': hcap.externalinput.ExternalInputType.COMPOSITE,
         'SVIDEO': hcap.externalinput.ExternalInputType.SVIDEO,
         'COMPONENT': hcap.externalinput.ExternalInputType.COMPONENT,
         'RGB': hcap.externalinput.ExternalInputType.RGB,
         'HDMI': hcap.externalinput.ExternalInputType.HDMI,
         'SCART': hcap.externalinput.ExternalInputType.SCART,
         'OTHERS': hcap.externalinput.ExternalInputType.OTHERS,
      }

      this.HDMI = {
         'hdmi1': 0,
         'hdmi2': 1
      }
   }

   getCurrentExternalInput(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.externalinput.getCurrentExternalInput({
            "onSuccess" : function(s) {
               console.log("HcapExternalInput.getCurrentExternalInput: success|" + s.mode + " " + s.index);
               resolve(s)
           },
           "onFailure" : function(f) {
               console.log("HcapExternalInput.getCurrentExternalInput: fail|" + f.errorMessage);
               reject(f)
           }
         })
      });
      return hcapPromise
   }

   getExternalInputList(mode){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.externalinput.getExternalInputList({
            "onSuccess" : function() {
               //currently do not do anything with this
               console.log("HcapExternalInput.getExternalInputList: success");
               resolve(true)
           },
           "onFailure" : function(f) {
               console.log("HcapExternalInput.getExternalInputList: fail|" + f.errorMessage);
               reject(f)
           }
         })
      });
      return hcapPromise
   }

   isExternalInputConnected(params){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.externalinput.isExternalInputConnected({
            ...params,
            "onSuccess" : function(s) {
               //currently do not do anything with this
               console.log("HcapExternalInput.isExternalInputConnected: success| " + s.isConnected);
               resolve(true)
           },
           "onFailure" : function(f) {
               console.log("HcapExternalInput.isExternalInputConnected: fail|" + f.errorMessage);
               reject(f)
           }
         })
      });
      return hcapPromise
   }

   setCurrentExternalInput(params){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.externalinput.setCurrentExternalInput({
            ...params,
            "onSuccess" : function() {
               //currently do not do anything with this
               console.log("HcapExternalInput.setCurrentExternalInput: success");
               resolve(true)
           },
           "onFailure" : function(f) {
               console.log("HcapExternalInput.setCurrentExternalInput: fail |" + f.errorMessage);
               reject(f)
           }
         })
      });
      return hcapPromise;
   }

}

const hcapExternalInput = new HcapExternalInput();
export default hcapExternalInput;