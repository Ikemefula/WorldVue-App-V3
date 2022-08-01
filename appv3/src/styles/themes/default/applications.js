// import palette from "../palette"
import tinycolor from 'tinycolor2';
import tinygradient from 'tinygradient';
import apps_background_image from '../../assets/images/apps_page_background.png';
import left_panel_image from '../../assets/images/guidePanelCity.png';

const applicationsStyles = (palette)=>{
   let grad1 = tinygradient(tinycolor(palette.primary.main), tinycolor(palette.common.black));
   let grad1Colors = grad1.rgb(4);
   return {
      "appsBackgoundLayer": {
         'position': 'absolute',
         'top':'0px',
         'left':'0px',
         'width': '1920px',
         'height': '1080px',
         background:`url(${apps_background_image})`,
         mixBlendMode:'overlay'
      },
      "darkOverlay":{
         'position': 'absolute',
         'top':'0px',
         'left':'0px',
         'width': '1920px',
         'height': '1080px',
         'background': 'linear-gradient(180deg, #0f161d 0%, #00070d 100%)'
      },
      "lightOverlay": {
         'position': 'absolute',
         'top':'0px',
         'left':'0px',
         'width': '1920px',
         'height': '1080px',
         background: 'linear-gradient(180deg, #d9e6ff 0%, #ffc99b 100%)',
         backgroundColor: 'rgba(255,255,255,1.0)',
      },
      "appsPageContainer": {
         // background: 'transparent linear-gradient(180deg, #0F161D 0%, #00070D 100%) 0% 0% no-repeat padding-box',
         width: '1920px',
         height: '1080px',
         opacity: 1
      },
      'appItemsSection':{
         position:'absolute',
         left:140,
         top:128,
         opacity:0,
         display:'flex',
         flexWrap:'wrap',
         width: '562px',
         maxHeight: '840px',
         // background: 'rgba(0,0,0,0.5)'
      },
      'appItemContainer': {
         height:'260px',
         width:'260px',
         margin:"10px",
         borderRadius: "17px",
      },
      'appItemContent': {
         'display':'flex',
         'fontSize':'20px',
         'border': '1px solid black',
         'borderRadius': '17px',
         'height': "260px",
         'width': "260px",
         opacity: 1
         ,
      },
      'appSelected': {
         border:'2px solid white'
      },
      'infoBlade':{
         'position': 'absolute',
         'top':'0px',
         'left':'0px',
         'width': '952px',
         'height': '100%',
         // background: 'transparent linear-gradient(21deg, #08529E 0%, #100B0B 100%) 0% 0% no-repeat padding-box',
         // 'mixBlendMode': 'overlay',
         opacity: 1
      },
      'infoContentBackground': {
         position:'absolute',
         top: '221px',
         left: '218px',
         width: '522px',
         height: '610px',
         background: '#000000 0% 0% no-repeat padding-box',
         // mixBlendMode: 'color',
         borderRadius: '8px',
         opacity: 0.9,
         zIndex:100
      },
      'infoContentContainer': {
         position:'absolute',
         top: '221px',
         left: '218px',
         width: '522px',
         height: '610px',
         opacity: 1,
         zIndex:101
      },
      'appsRightPanel':{
         position:'absolute',
         height: '1080px',
         width: '960px',
         top:0,
         right:-963,
         display:'flex',
         // border: "1px dashed black"
         // background: `url(${left_panel_image})`,
         // mixBlendMode: 'overlay'
      },
      'appsRightPanelBackgroundContainer': {
         flexGrow:1,
         display:'flex'
      },
      'appsRightPanelBackgroundImage': {
         flexGrow:1,
         display:'flex',
         // border: "1px dashed red",
         mixBlendMode: 'lighten',
         opacity: '0.1',
         background: `url(${left_panel_image})`,
      },
      'appsRightPanelBackgroundGradient': {
         flexGrow:1,
         // border: "1px dashed blue",
         display:'flex',
         'background': `linear-gradient(259deg, ${grad1Colors[0]} 0%, ${grad1Colors[1]} 25%, ${grad1Colors[2]} 68%, ${grad1Colors[3]} 100%)`,
      },
      //app styles
      'amazonContainer':{
         'background': 'linear-gradient(214deg, rgba(0,0,0,1) 20%, rgba(29,178,228,1) 200%)',
      },
      'youtubeContainer': {
         'background': 'linear-gradient(214deg, rgba(0,0,0,1) 20%, rgba(170,16,16,1) 200%)',
      },
      'pandoraContainer': {
         'background': 'linear-gradient(214deg, rgba(0,0,0, 1) 20%, rgba(54,104,255,1) 200%)',
      },
      'showtimeContainer': {
         'background': 'linear-gradient(214deg, rgba(0,0,0,1) 20%, rgba(110,0,0,1) 200%)',
      },
      'bluetoothContainer': {
         'background': 'linear-gradient(214deg, rgba(0,0,0,1) 20%,rgba(84,105,193,1) 200%)',
      },
      'netflixContainer':{
         'background': 'linear-gradient(214deg, rgba(0,0,0,1) 20%,rgba(244,6,18,1) 200%)',
      }
   }
};

export default applicationsStyles