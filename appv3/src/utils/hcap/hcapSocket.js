import hcap from './hcap';
import site from '../../app/config/site.json';
import {store} from '../../app/store';
import {setDaemonSocket} from './hcapReducer';

class HcapSocket {

   constructor(){
      this.server = site.server;
      //udp data should be sent to same server that recieves reportIns
      this.udpListenerIp = this.server.procentricIp;
      if(this.server.reportInIp){
         this.udpListenerIp = this.server.reportInIp;
      }
      this.udpListenerPort = this.server.udpListenerPort
   }

   openTcpDaemon(){
      let _this = this;
      let hcapPromise = new Promise(function(resolve, reject){
         hcap.socket.openTcpDaemon({
            "port" : 9312,
            "onSuccess" : function() {
               console.log("HcapSocket.openTcpDaemon: success");
               _this.updateState('tcpDaemonState', 'open');
               resolve(true)
            },
            "onFailure" : function(f) {
               console.log("HcapSocket.openTcpDaemon: fail| " + f.errorMessage);
               reject(f)
            }
         });
      });
      return hcapPromise
   }

   closeTcpDaemon(){
      let _this = this;
      let hcapPromise = new Promise(function(resolve, reject){
         hcap.socket.closeTcpDaemon({
            "port" : 9312,
            "onSuccess" : function() {
               console.log("HcapSocket.closeTcpDaemon: success");
               _this.updateState('tcpDaemonState', 'closed');
               resolve(true)
            },
            "onFailure" : function(f) {
               console.log("HcapSocket.closeTcpDaemon: fail| " + f.errorMessage);
               reject(f)
            }
         });
      });

      return hcapPromise
   }

   sendUdpData(data){
      let _this = this;
      let hcapPromise = new Promise(function(resolve, reject){
         //TODO: determine if there is network connectivity. If not return. this way we dont put unneeded strain on the STB
         if(data.length === 0){
            resolve(true)
         }
         hcap.socket.sendUdpData({
            "port" : _this.server.udpListenerPort,
            "ip" :  _this.udpListenerIp,
            "udpData": data,
            "onSuccess" : function() {
               resolve(true)
            },
            "onFailure" : function(f) {
               console.log("HcapSocket.sendUdpData: fail| " + f.errorMessage);
               reject(f)
            }
         });
      });
      return hcapPromise
   }

   tcpDaemonIsOpen(){
      let {socket} = store.getState()
      return (socket.tcpDaemonState === 'open');
   }

   updateState(property, value){
      store.dispatch(setDaemonSocket({
         "property": property,
         "value":value
      }));
   }
}

const hcapSocket = new HcapSocket();

export default hcapSocket;

