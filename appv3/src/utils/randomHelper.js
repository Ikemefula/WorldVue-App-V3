import seedrandom from 'seedrandom';

class RandomHelper {
   constructor(){
      this.seed = null;
      //extra_entropy is an arbitrary value that seemed to give decent distribution over all existing
      //mac addresses in the stb_master
      this.extra_entropy = 'entropy-329384';
      this.random = null;
   }

   initialize(macAddress){
      //see the rng with the mac_address + extra entropy
      this.seed = macAddress + this.extra_entropy;
      console.log("Initializing RandomHelper seed: " + this.seed);
      //creates a seeded random() function.
      //This function will produce the same consecutive numbers from moment of instanciation based on the seed.
      //every session of the app should produce the same set of random values.
      this.random = seedrandom(this.seed);
   }

   randomHour(){
      if(this.random === null) throw(Error("Random Helper not initialized"));
      return Math.Floor(this.random() * 24);

   }
   randomMinute(){
      if(this.random === null) throw(Error("Random Helper not initialized"));
      return Math.Floor(this.random() * 60);

   }
   randomSecond(){
      if(this.random === null) throw(Error("Random Helper not initialized"));
      return Math.Floor(this.random() * 60);

   }
   randomMillisecond(){
      if(this.random === null) throw(Error("Random Helper not initialized"));
      return Math.Floor(this.random() * 1000);
   }
}

let randomHelper = new RandomHelper();
export default randomHelper;