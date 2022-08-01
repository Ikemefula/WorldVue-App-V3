//src/utils/timeHelper.js
//time formatting and calculating helper functions
import dayjs from 'dayjs';
// import site from '../app/config/site.json';

class TimeHelper{

   //guide formats
   static getFormattedTime(time){
      //use formatting configuration from site.json
      return TimeHelper.format('h:mmA', time)
   }
   static getFormattedDate(time){
      //use formatting configuration from site.json
      return TimeHelper.format('MMMM D', time)
   }

   static format(formatString, inputToFormat){
      if(dayjs.isDayjs(inputToFormat)){
         return inputToFormat.format(formatString)
      }
      else if(Number.isInteger(inputToFormat)){
         return dayjs(inputToFormat).format(formatString)
      }
      else {
         return dayjs().format(formatString)
      }
   }

   static getFormattedDateTime(){
      //use formatting configuration from site.json
   }

   static calcInterval({hours, minutes, seconds, milliseconds}){
      //convert input params into milliseconds to be used in timeout or interval
      let hour_factor = hours !== undefined ? TimeHelper.conversionsFactors.HOUR.MILLISECONDS : 0;
      let minute_factor = minutes !== undefined ? TimeHelper.conversionsFactors.MINUTES.MILLISECONDS : 0;
      let second_factor = seconds !== undefined ? TimeHelper.conversionsFactors.SECONDS.MILLISECONDS : 0;
      return (hours * hour_factor) + (minutes * minute_factor) + (seconds * second_factor) + milliseconds;
   }

   static getNearest30MinuteInterval(time=dayjs()){
      console.log(time.format("YYYY-MM-DD h:mm A"));
      console.log(time.minute());
      if(time.minute() >  30){
         return time.minute(30).second(0).millisecond(0);
     } else {
         return time.minute(0).second(0).millisecond(0);
     }
   }
}

TimeHelper.conversionsFactors = {
   'HOUR':{
      'MINUTES': 60,
      'SECONDS': 60 * 60,
      'MILLISECONDS': 60 * 60 * 1000
   },
   'MINUTES':{
      'HOURS': 1/60,
      'MINUTES': 1,
      'SECONDS': 60,
      'MILLISECONDS': 60 * 1000
   },
   'SECONDS':{
      'HOUR': 1 / 60 * 60,
      'MINUTES': 1/60,
      'SECONDS': 1,
      'MILLISECONDS': 1000
   },
   'MILLISECONDS':{
      'HOUR': 1 / 1000 * 60 * 60,
      'MINUTES': 1/ 1000 * 60,
      'SECONDS':1/1000,
      'MILLISECONDS':1,
   }
}

export default TimeHelper