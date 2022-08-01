import hcap from './hcap';
import {store} from '../../app/store';
import logger from '../logger';
import { setInstalledApps } from '../../features/applications/AppsReducer';

class HcapPreloadedApplication {

   launchPreloadedApplication(params){
      let hcapPromise = new Promise((resolve, reject)=>{
         logger.log('HcapPreloadedApplication.launchPreloadedApplication: Launching ' + params.name + " " + params.id);
         let {name, ...launchParams} = params;
         console.log(launchParams)
         hcap.preloadedApplication.launchPreloadedApplication({
            ...launchParams,
            "onSuccess": ()=>{
               logger.log("HcapPreloadedApplication.launchPreloadedApplication: success| " + name);
            },
            "onfailure": (f)=>{
               logger.log("HcapPreloadedApplication.launchPreloadedApplication: fail|  " + f.message);
            }
         });
      });
      return hcapPromise;
   }

   destroyPreloadedApplication(params){
      logger.log('HcapPreloadedApplication.destroyPreloadedApplication: Destroying ' + params.name + " " + params.id)
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.preloadedApplication.destroyPreloadedApplication({
            'id': params.id,
            "onSuccess": ()=>{
               logger.log("HcapPreloadedApplication.destroyPreloadedApplication: success| " + params.name)
            },
            "onfailure": (f)=>{
               logger.log("HcapPreloadedApplication.destroyPreloadedApplication: fail| " + f.message)
            }
         });
      });
      return hcapPromise;
   }

   getPreloadedApplicationList(){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.preloadedApplication.getPreloadedApplicationList({
            "onSuccess" : function(s) {
               logger.log("HcapPreloadedApplication.getPreloadedApplicationList: success| " +  s.list.length + " apps found");
               store.dispatch(setInstalledApps(s.list));
               resolve(s.list);
            },
            "onFailure" : function(f) {
                console.log("onFailure : errorMessage = " + f.errorMessage);
                reject(f.message);
            }
         });
      });
      return hcapPromise
   }
}


const hcapPreloadedApplication = new HcapPreloadedApplication();
export default hcapPreloadedApplication