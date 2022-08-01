import hcapSocket from './hcap/hcapSocket'
class Log {

   log(message){
      let data = {'type': 'LOG', 'data': message}
      console.log(message)
      this.send(data);
   }

   warn(message){
      let data = {'type': 'WARN', 'data': message}
      console.log(message)
      this.send(data);
   }
   error(message){
      let data = {'type': 'ERROR', 'data': message}
      console.log(message)
      this.send(data);
   }

   send(data){
      hcapSocket.sendUdpData(JSON.stringify(data));
   }

}

const Logger = new Log();
export default Logger;