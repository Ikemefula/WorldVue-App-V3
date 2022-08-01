import hcap from './hcap'
import {store} from '../../app/store';
import {setProperty} from './hcapReducer'
class HcapProperty {

   static getProperty(property){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.property.getProperty({
            'key': property,
            'onSuccess': function(s){
               HcapProperty.updateState(property, s.value)
               resolve(s.value);
            },
            'onFailure': function(f){
               console.log('HCAPFAIL: HcapProperty.getProperty:' + f.errorMessage);
               reject(f.message);
            }
         });
      });
      return hcapPromise
   }

   static setProperty(property, value){
      let hcapPromise = new Promise((resolve, reject)=>{
         hcap.property.setProperty({
            'key': property,
            'value': value,
            'onSuccess': function(){
               console.log(`HcapProperty.setProperty: success| ${setProperty} - ${value}`);
               HcapProperty.updateState(property, value);
               resolve(value);
            },
            'onFailure': function(f){
               console.log('HcapProperty.setProperty: fail| ' + f.errorMessage);
               reject(f.message);
            }
         });
      });
      return hcapPromise
   }

   static updateState(property, value){
      //set redux state
      store.dispatch(setProperty({
         "property": property,
         "value":value
      }))
   }
}

export default HcapProperty