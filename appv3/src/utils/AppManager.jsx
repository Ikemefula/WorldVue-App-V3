// import hcap from './hcap/hcap';
import logger from './logger';
import eventManager from './EventManager';
import siteConfig from '../app/config/site.json';
import hcap from './hcap/hcap';
import HcapProperty from './hcap/hcapProperty';
import HcapSocket from './hcap/hcapSocket';
import HcapChannel from './hcap/hcapChannel';
import HcapPower from './hcap/hcapPower';
import HcapNetwork from './hcap/hcapNetwork';
import HcapSystem from './hcap/hcapSystem';
import HcapMode from './hcap/hcapMode';
import HcapApplication from './hcap/hcapApplication';
import HcapPreloadedApplication from './hcap/hcapPreloadedApplication';
import KeyHandler from './keyHandler';
import RandomHelper from './randomHelper';
import ChannelManager from './ChannelManager';
import {reportApi} from '../app/api/report';
import {store} from '../app/store';
import {setActiveChannel} from '../features/guide/GuideReducer';
import dayjs from 'dayjs';
import GuideBuilder from './GuideBuilder';

class AppManager {
   
   async init(){
      try{
         logger.log("AppManager Initializing");
         HcapSystem.getBrowserDebugMode().then((result)=>{
            if(result.debugMode !== siteConfig.browserDebugMode){
               logger.log("Toggling Browser Debug Mode: " + siteConfig.browserDebugMode)
               HcapSystem.setBrowserDebugMode(siteConfig.browserDebugMode);
            }
         })
         await HcapProperty.setProperty('display_resolution', siteConfig.browserResolution);
         eventManager.initializeListeners();
         // get and initialize guide data.. takes a while on the stb
         await ChannelManager.initializeGuideData();
          //add key items
         await KeyHandler.registerCustomKeys();
         //get properties
         logger.log("Getting properties")
         let startup_properties_to_get = [
            HcapProperty.getProperty('serial_number'),
            HcapProperty.getProperty('model_name'),
            HcapProperty.getProperty('platform_version'),
            HcapProperty.getProperty('ptc_version'),
            // HcapProperty.getProperty('instant_power'), //maybe?
            HcapProperty.getProperty('xait_version'),
            HcapProperty.getProperty('room_number'),
            HcapProperty.getProperty('lg_service_xml_version'),
            HcapProperty.getProperty('hcap_js_extension_version'),
            HcapProperty.getProperty('hcap_middleware_version'),
            HcapProperty.getProperty('hardware_version'),
         ]
         await Promise.all(startup_properties_to_get)
         logger.log("Getting properties done")
         //get power state
         let currentChannel = null
         //default to logical 2 is safe i think. 
         //The app will eventually need to be able to handle a case where we are unable to get the current channel on startup
         let currentLogicalChannel = 2 
         try{
            logger.log("Current Channel Initialization")
            currentChannel = await HcapChannel.getCurrentChannel();
            currentLogicalChannel = currentChannel.logicalNumber;
            //validate current logical channel 
            if(GuideBuilder.getIndexFromLogical(currentLogicalChannel) === null){
               currentLogicalChannel = 2;
            }
            if(currentChannel === null){
               logger.log("current channel is null");
            }
            else {
               store.dispatch(setActiveChannel(currentChannel.logicalNumber));
            }
         }
         catch(err){
            logger.log("Error getting current channel")
            currentLogicalChannel = 2;
            store.dispatch(setActiveChannel(currentLogicalChannel));
         }
         logger.log("Initializing Guide View")
         let view = GuideBuilder.getNextView(currentLogicalChannel, dayjs().valueOf());
         GuideBuilder.setCurrentView(view);
         try{
            logger.log("Opening TCP Daemon")
            await HcapSocket.openTcpDaemon();
         }
         catch{
            logger.log("TCP open failed")
         }
         //initialize installed apps data
         logger.log("Getting preloaded application list");
         await HcapApplication.getApplicationList();
         await HcapPreloadedApplication.getPreloadedApplicationList();
         // check and register apps that have not yet been registered
         logger.log("Checking for registred apps");
         await HcapApplication.registerApps()
         let mode = await HcapMode.getHcapMode();
         if(mode.mode !== HcapMode.mode.HCAP_MODE_1){
            logger.log("Setting HCAP MODE 1");
            await HcapMode.setHcapMode(HcapMode.mode.HCAP_MODE_1);
         }
         logger.log("Getting Power Mode")
         await HcapPower.getPowerMode();
         //get network information
         logger.log("Getting network information")
         let result = await HcapNetwork.refreshNetworkInformation();
         //now that we have a mac address we can initialize the random helper
         logger.log("Initializing Random")
         if(result.networkInformation.mac !== null){
            RandomHelper.initialize(result.networkInformation.mac)
         }
         //set properties
         try{
            logger.log("Reporting startup")
            await this.reportStartup();
            setInterval(this.reportStartup, 300000)
         }
         catch(err){
            logger.log("Report Startup Failed");
         }
      }
      catch(err){
         logger.log("Startup error");
         console.log(err);
         logger.log(err.message);
      }
   }

   async reportStartup(){
      logger.log("Reporting Startup");
      let {property, power, network} = store.getState().hcap
      let reportData = {
         'serialNumber': property.serial_number,
         'label': property.room_number,
         'modelName': property.model_name,
         'platformVersion': property.platform_version,
         'ptcVersion': property.ptc_version,
         'hcapJsExtensionVersion': property.hcap_js_extension_version,
         'hardwareVersion': property.hardware_version,
         'lastMajorEvent': power.mode === HcapPower.powerMode.WARM ? 'POWER_DOWN' : 'POWER_UP',
         'appVersion': "wci_3.0-hitec-alpha",
         'macAddress': network.mac,
         'lastStartTime': dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      logger.log(JSON.stringify(reportData));
      if(hcap.wci.isDev()){
         reportData.isVirtual = 1;
      }

      await store.dispatch(reportApi.endpoints.reportStartup.initiate(reportData));
   }

   async reportIn(){
      let {property, power, channel} = store.getState().hcap
      //regular full state update
      let logicalChannel = channel.currentChannel === null ? null : channel.currentChannel.logicalNumber;
      let channelStatus = channel.currentChannel === null ? null : channel.currentChannel.channelStatus;
      let reportData = {
         'serialNumber': property.serialNumber,
         'logicalChannel': logicalChannel,
         'channelStatus':channelStatus,
         'lastKeyPress': null,
         'lastKey': null,
         'uptime': 0,
         'lastMajorEvent': power.mode === HcapPower.powerMode.WARM ? 'POWER_DOWN' : 'POWER_UP',
         'currentAppLaunched': null
      }
      await store.dispatch(reportApi.endpoints.reportState.initiate(reportData));
   }

   async reportStateChange(){
      //small state change updates like power state
   }

   async syncTime(){

   }
}

const manager = new AppManager();

export default manager