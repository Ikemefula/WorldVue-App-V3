import hcap from './hcap'

class HcapKey {
   constructor(){
      this.keycodes = {
         LAST5500: 166,
         K_EXIT:27,      // esc
         K_BACK:8,       // backspace
         K_YELLOW:90,    // z
         K_BLUE:88,      // x
         K_RED:67,       // c
         K_GREEN:86,     // v
         K_LAST:188 ,    // ,
         K_VOL_UP:187,   // ]
         K_VOL_DOWN:189, // '
         K_CH_UP:33,     // PgUp
         K_CH_DOWN:34,   // PgDn
         K_MUTE:77,      // m
         K_ON_DEMAND:78, // n
         K_PORTAL:36,    // home
         K_APPS:65,      // a
         K_GUIDE:71,     // g
         K_INFO:73,     // i
         ...hcap.key.Code
      }
   }

   addKeyItem(keycode, virtualKeycode, attribute){
      let hcapPromise = new Promise(function(resolve, reject){
         hcap.key.addKeyItem({
            "keycode": keycode,
            "virtualKeycode": virtualKeycode,
            "attribute": attribute,
            "onSuccess": function() {
               console.log('hcapKey.addKeyItem - Added key into STB: keycode: ' + keycode + ', virtualKeycode: ' + virtualKeycode + ', attribute: ' + attribute);
               resolve(true);
            },
            "onFailure": function(f) {
               console.log('hcapKey.addKeyItem', 'Error: ' + f.errorMessage);
               reject(false);
            }
         });
      });
      return hcapPromise;
   }

   sendKey(keycode){
      let hcapPromise = new Promise(function(resolve, reject){
         hcap.key.sendKey({
            "virtualKeycode" : keycode,
            "onSuccess" : function() {
               resolve(true);
            },
            "onFailure" : function(f) {
               reject(false);
            }
         });
      });
      return hcapPromise;
   }
}

const hcapKey = new HcapKey();

export default hcapKey;