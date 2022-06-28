const webpack = require('webpack');
const wpConfig = require('./webpack.config');
const xml2js = require('xml2js');
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
var Client = require('ssh2-sftp-client');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-i, --ip <ip>', 'Adam IP to deploy to or user local if this is a local deploy', 'local')
  .option('-p, --procentricIp <ip>', 'Adam IP to deploy to or user local if this is a local deploy', '172.18.0.1')
  .option('-t, --theme <theme>', 'Theme to Deploy', 'minimal_v3')
  .option('-e, --env <env>', 'Deployment environment', 'dev')
  .option('-h, --hothost <host>', 'Hot load from this ip', null)
  .parse(process.argv);

var zipFile = 'procentric_'+commander.theme+'.zip';
var hadWebPackError = false;
var env = {}
switch(commander.env){
   case 'production':
      env = {production:true};
      break;
   case 'stb':
      env = {stb:true};
      break;
   case 'dev':
      env = {development:true};
      break;
   default:
      env = {production:true};
}

let promise1 = new Promise(function(resolve, reject){
   console.log(wpConfig(env));
   webpack(wpConfig(env), (err, stats) => { // Stats Object
     if (err || stats.hasErrors()) {
         hadWebPackError = true;
         reject(stats);
      }
      resolve(stats);
   });
});

promise1.then(
   (data)=>{
      if(commander.ip != 'local'){
         console.log("Remote Deployment");
         sftpDeploy();
      }
   },
   (err)=>{
      console.log("Webpack had an error exiting");
      console.log(err)
      process.exit();
   });


function sftpDeploy(){
   let sftp = new Client();
   sftp.connect({
      host: commander.ip,
      username: 'root',
      password: 'm88$sTro'
   }).then((data)=>{
      //bump xait file
      return sftp.get('/var/wci/www/application/xait.xml');
   }).then((data) => {
      console.log("Parsing xait");
      let parser = new xml2js.Parser();
      let xml = '';
      parser.parseString(data.toString(), function (err, result) {
         let versionNumber = parseInt(result.XAIT.versionNumber[0]);
         let version = parseInt(result.XAIT.AbstractService[0].ApplicationList[0].Application[0].applicationDescriptor[0].version[0]);
         // result.XAIT.AbstractService[0].ApplicationList[0].Application[0].HcapDescriptor[0].url[0]

         versionNumber++;
         version++;
         result.XAIT.versionNumber[0] = versionNumber;
         result.XAIT.AbstractService[0].ApplicationList[0].Application[0].applicationDescriptor[0].version[0] = version;
         if(commander.hothost !== null){
            console.log("Hot Hosting")
            result.XAIT.AbstractService[0].ApplicationList[0].Application[0].HcapDescriptor[0].url[0] = `http://${commander.hothost}:8080`
         }
         else {
            result.XAIT.AbstractService[0].ApplicationList[0].Application[0].HcapDescriptor[0].url[0] = 'http://'+commander.procentricIp+'/procentric/application/'+zipFile
         }
         let builder = new xml2js.Builder()
         xml = builder.buildObject(result);
         console.log("versionNumber: " + versionNumber);
         console.log("version: " + version);
         console.log("url: " + result.XAIT.AbstractService[0].ApplicationList[0].Application[0].HcapDescriptor[0].url[0]);
         console.log(xml);
      });
      if(xml.length == 0){
         throw(Error("Error: XML Length 0"));
      }
      let buffer = Buffer.from(xml);
      return sftp.put(buffer, '/var/wci/www/application/xait.xml');
      
   }).then((data)=>{
      if(commander.hothost){
         process.exit() // no need to do anything else.
      }
      console.log("Removing current zip");
      return sftp.delete('/var/wci/www/application/'+zipFile, false);
   })
   .then((data)=>{
      let archive = createZipFile();
      return sftp.put(archive, '/var/wci/www/application/'+zipFile);
   }, (error)=>{
      console.log("Zip file delete error. Probably didn't exist")
      let archive = createZipFile();
      return sftp.put(archive, '/var/wci/www/application/'+zipFile);
   }).then((data)=>{
      sftp.end();
   }).catch((err) => {
      console.log(err, 'catch error');
      sftp.end();
   });
}

function localDeploy(){
   console.log("Not built yet");
}

function createZipFile(){
   let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
   });

   // archive.pipe(output);
   let folderToZip = path.resolve('dist');
   console.log("Ziping path: " + folderToZip);
   archive.directory(folderToZip+'/', false);
   archive.file('./public/channelLineup.json', {name:'channelLineup.json'});
   archive.file('./public/guideData.json', {name:'guideData.json'});
   archive.finalize();
   return archive;
}