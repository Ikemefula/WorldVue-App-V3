import hcap from './hcap.js';
import {store} from '../../app/store';
import logger from '../logger';
import {authApi} from '../../app/api/auth';

class HcapApplication {

   constructor(){
      this.registrationApps = {
         "Netflix":{
            id:'netflix',
            token: null
         },
         "Amazon Prime Video":{
            id:'amazon',
            token: null
         }
      }
   }

   getApplicationList(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.application.getApplicationList({
            "onSuccess":function(s){
               logger.log("HcapPreloadedApplication.getApplicationList: Success");
               logger.log(JSON.stringify(s));
               resolve(s);
            },
            "onFailure": function(f){
               logger.log(f.message);
               reject();
            }
         });
      });
      return hcapPromise
   }

   registerSIApplicationList(application_list){
      console.log(application_list);
      let hcapPromise = new Promise((resolve, reject)=>{
         // hcap.application.RegisterSIApplicationList({
         //    "tokenList" : application_list,
         //    "onSuccess": function(s){
         //       logger.log("Register SI Application list success")
         //       for(let app of application_list){
         //          logger.log("Registered: " + app.id);
         //       }
         //       resolve(true)
         //    },
         //    "onFailure": function(f){
         //       reject(f)
         //    }
         // })
         //WCI token
         var NetflixTokenString = "YAiXjTCXuFUKZT9pd7KETGLonuf/jnQQ0inzCywdCag1avI7CSgAiblznTU7JiFqfsqx8NSjWfZeFtW4ZUuLiqvXQsf8kLIj3IRnyMDQtIZHO3Gih5DmGziSaUhpr4w8+7v9H1YVr3SnlYfmfDQhNur/Tl4zuDY6mNJcs7MlXoaXwq7muhV8vJA7g79/oJunHKVy36gMT0+eVOTqesrZriryjZhAkvQIE0jSaGZc9vuT7hKPMvBgttJD17z3BU6CI9q3qUmlK3w/Jha+GqBkDv18DdYxRPvdf29TzwtXNNociNx/40vHaSAuP6O0Xizn1LsJczB/0ixDuWkrpj/lJA==";
         var AmazonTokenString ="nOHakXm7u4Mz24s0/ae+kjlHNfwrM3nFAyKSX0YQ1GmvXCk8kzHFwz2j3zlmNB4B9DM/sWH2/IEqavBKUEgqm9fstX4rlPCbVcgDacQKD9qcVquWP8v0QayMB5/nwXwJtGTi0SdqC5rplZ/KATo2CwhFgeUEIZ7JJAZ5dEUo9dlLAXi+anF7aCd/N9qvx66B83jxxW5ZVS7MTa0u/2XAZaqRQkYI+NJQXMJ+7pnIJNXxUwMyOMlh9vbSwA2KBn56RkxgloTSvskCF4wXaMLBIuordzB+h4BiwcPWE5iqvyjqXm7ICUNGAIe0h0GgfmzZKsqF23xUtBoOGzEcrn0RCQ==";
         hcap.application.RegisterSIApplicationList({
            "tokenList" : [{"id":"amazon","token" : AmazonTokenString}, {"id":"netflix","token" : NetflixTokenString}],
            "onSuccess":function() {
               console.log("AmazonTokenString onSuccess");
               resolve();
            },
            "onFailure":function(f) {
               console.log("onFailure : errorMessage = " + f.errorMessage);
               reject();
            }
         });
      });
      return hcapPromise
   }
   //[{"id": "amazon", "token": "{long_token_string_from_license_file}"}, {"id": "netflix", "token": "{long_token_string_from_license_file}"}]
   async registerApps(){
      console.log("Checking for apps to register");
      let installedApps = store.getState().applications.installedApps;
      let appsToRegister = {
         'Netflix':true,
         'Amazon Prime Video': true
      }
      for(let app of installedApps){
         if(app.title in appsToRegister){
            appsToRegister[app.title] = false
         }
      }
      let registrationList = []
      for(let app in appsToRegister){
         if(appsToRegister[app]){
            try{
               let response = await store.dispatch(authApi.endpoints.getLicense.initiate(this.registrationApps[app].id));
               this.registrationApps[app].token = response.data.token;
               registrationList.push(this.registrationApps[app])
            }
            catch(err){
               console.log(err);
               console.log("Error getting license token for " + app);
            }
         }
      }
      if(registrationList.length > 0){
         await this.registerSIApplicationList(registrationList);
      }
      return true
   }

   destroyApplication(){
      const hcapPromise = new Promise((resolve, reject)=>{
         hcap.application.destroyApplication({
            "onSuccess": ()=>{

            },
            "onFailure": ()=>{

            }
         })
      })
      return hcapPromise;
   }

   launchApplication(params){
      const hcapPromise = new Promise((resolve, reject)=>{
         logger.log('HcapApplication.launchApplication: Launching ' + params.id);
         let {name, ...launchParams} = params;
         console.log(launchParams)
         hcap.application.launchApplication({
            ...launchParams,
            "onSuccess": ()=>{
               logger.log("HcapApplication.launchApplication: success| " + params.id)
            },
            "onFailure": (f)=>{
               logger.log("HcapApplication.launchApplication: fail| " + f.message)
            }
         })
      })
      return hcapPromise;
   }

   getDefaultServiceXml(){
      const hcapPromise = new Promise((resolve, reject)=>{
         hcap.application.getDefaultServiceXml({
            "onSuccess": ()=>{

            },
            "onFailure": ()=>{

            }
         })
      })
      return hcapPromise;
   }

   getServiceXml(){
      const hcapPromise = new Promise((resolve, reject)=>{
         hcap.application.getServiceXml({
            "onSuccess": ()=>{

            },
            "onFailure": ()=>{

            }
         })
      })
      return hcapPromise;
   }

}

const hcapApplication = new HcapApplication();
export default hcapApplication