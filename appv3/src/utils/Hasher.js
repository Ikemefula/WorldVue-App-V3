import Hashids from 'hashids'
class Hasher{
   static generateShowtimeHash(input) {
      var salt = 'SHOWTIME_SALT_HASH';
      var alphabet = '1234567890abcdefghijklmnopqrxyz';
      var chars = input.split('');
      //convert non-numeric characters to ints
      for (var x = 0; x < chars.length; x++) {
        if (isNaN(parseInt(chars[x], 10))) {
          chars[x] = chars[x].charCodeAt(0);
        }
      }
      var numeric_string = chars.join('');
      //hash
      //only integers can be hashed using Hashids
      var room_int = parseInt(numeric_string);
      var hashids = new Hashids(salt, 16, alphabet);
      //produce 16 character hash using salt and alphabet character set
      var roomHashId = hashids.encode(room_int);
      return roomHashId;
   }
}

export default Hasher