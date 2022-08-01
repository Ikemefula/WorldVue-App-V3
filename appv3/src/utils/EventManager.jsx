import keyHandler from "./keyHandler";
import hcapChannel from './hcap/hcapChannel';
import HcapProperty from "./hcap/hcapProperty";
import HcapPreloadedApplication from "./hcap/hcapPreloadedApplication";
import HcapExternalInput from "./hcap/hcapExternalInput";
import logger from './logger';
import hcapKey from "./hcap/hcapKey";
import {applist} from '../features/applications/AppsPage';
class EventManager {
   constructor(){
      this.listeners = {
         'channel_changed': (event)=>{
            logger.log("EVENT RECEIVED: channel_changed");
            hcapChannel.getCurrentChannel();
         },
         'channel_status_changed': (event)=>{
            logger.log("EVENT RECEIVED: channel_status_changed");
            hcapChannel.getCurrentChannel();
         },
         'external_input_changed': (event)=>{
            logger.log("EVENT RECEIVED: external_input_changed")
         },
         'hcap_application_focus_changed': (event)=>{
            logger.log("EVENT RECEIVED: hcap_application_focus_changed")
         },
         'hdmi_connection_changed': (event)=>{
            logger.log("EVENT RECEIVED: hdmi_connection_changed")
         },
         'media_event_received': (event)=>{
            logger.log("EVENT RECEIVED: media_event_received")
         },
         'network_event_received': (event)=>{
            logger.log("EVENT RECEIVED: network_event_received")
         },
         'power_mode_changed': (event)=>{
            logger.log("EVENT RECEIVED: power_mode_changed")
         },
         'property_changed': (event)=>{
            logger.log("EVENT RECEIVED: property_changed - " + event.key)
            HcapProperty.getProperty(event.key).then((result)=>{
               logger.log("New property value: " + event.key + " = " + result)
            })
         },
         'tcp_data_received': (event)=>{
            logger.log("EVENT RECEIVED: tcp_data_received")
            this.handleTcpMessage(JSON.parse(event.data));
         },
         'volume_level_changed': (event)=>{
            logger.log("EVENT RECEIVED: volume_level_changed")
         },
         'keydown': (event)=>{
            logger.log("EVENT RECEIVED: keydown - "+ event.keyCode)
            keyHandler.handleKeyPress(event.keyCode)
         },
         'on_destroy': (event)=>{
            logger.log("EVENT RECEIVED: on_destroy");
         },
         'application_registration_result_received': (event)=>{
            logger.log("EVENT RECEIVED: application_registration_result_received");
            logger.log("Registration Result: " + event.tokenResult)
            if(event.tokenResult){
               logger.log("Successful Registration")
               HcapPreloadedApplication.getPreloadedApplicationList();
            }
            else{
               logger.log("Failed Registration: " + event.errorMessage);
            }
         }
      }
      this.initialized = false;
   }

   initializeListeners(){
      if(this.initialized) return; //prevent listeners from being registered multiple times. 
      logger.log("Initializing Event Listeners") 
      for(let eventType in this.listeners){
         this.addListener(eventType, this.listeners[eventType]);
      }
      this.initialized = true;
   }

   removeListener(listener_key){
      document.removeEventListener(this.listeners[listener_key]);
   }

   handleTcpMessage(data){
      console.log("EventManger.handleTcpMessage");
      console.log(data);
      switch(data.dataType){
         case "SET_ROOM_NUMBER":
            HcapProperty.setProperty('room_number', data.roomNumber).then(()=>{
               HcapProperty.getProperty('room_number').then(result=>{
                  console.log(result); 
               });
            });
            break
         case "ROLL_CALL":
            break
         case "INCOMING_KEY":
            hcapKey.sendKey(data.key);
            break
         case "WEB_REMOTE_ACTION":
            this.performWebRemoteAction(data.action)
            break;
         case "LAUNCH_APP":
               let selected_app = null;
               for(let app of applist){
                  if(app.name === data.app){
                     selected_app = app
                     break;
                  }
               }

               let params = {
                  'id':selected_app.launch_id,
                  'name':selected_app.name
               }

               if(selected_app.parameters){
                  params.parameters = selected_app.parameters
               }

               if(selected_app.preloaded){
                  HcapPreloadedApplication.launchPreloadedApplication(params)
               }
               else {
                  HcapApplication.launchApplication(params)
               }

            break;
         default:
            logger.log("Uknown datatype received " + data.dataType)
      }
   }

   performWebRemoteAction(action){
      console.log("Performing web remote action");
      switch(action.type){
         case 'TOGGLE_CC':
            break;
         case 'SET_CURRENT_CHANNEL':
            hcapChannel.changeChannelRFClass1(action.logicalNumber);
            break;
         case 'SET_SOURCE':
            let source_params = null
            if(action.source === 'hdmi1'){
               source_params = {
                  'type': HcapExternalInput.sourceType.HDMI,
                  'index':0
               }
            }
            else if(action.source === 'hdmi2'){
               source_params = {
                  'type': HcapExternalInput.sourceType.HDMI,
                  'index':1
               }
            }
            else{
               console.log("EventManager.performWebRemoteAction.SET_SOURCE: invalid source " + action);
               return
            }
            HcapExternalInput.setCurrentExternalInput(source_params)
            break;
         default:
            console.log("Unknown action recieved")
      }
   }

   addListener(type, func){
      //store reference to this function so wen are able to remove is necessary
      this.listeners[type] = func
      logger.log("Adding Listener: " + type);
      document.addEventListener(type, func)
   }

}

const eventManager = new EventManager();
export default eventManager;