import tinycolor from 'tinycolor2';
import guideStyles from './guide';
import applicationStyles from './applications';
import compendiumStyles from './compendium';
import bannerStyles from './channelBanner';
import adBarStyles from './adBar';
import weddingBG from '../../assets/images/weddingBG.png'
// import bladeBackgroundImage from './assets/images/dallas-duotone@1x.png';
import visbyCFRegular from '../../assets/fonts/VisbyCF-Regular.otf';
import visbyCFBold from '../../assets/fonts/VisbyCF-Bold.otf';
import visbyCFHeavy from '../../assets/fonts/VisbyCF-Heavy.otf';
import visbyCFExtraBold from '../../assets/fonts/VisbyCF-ExtraBold.otf';
import montserratRegular from '../../assets/fonts/Montserrat-Regular.ttf';
import poppinsRegular from '../../assets/fonts/Poppins-Regular.ttf';

const fontFaces = [
   {'@font-face':{
      fontFamily: "visbyCFRegular",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${visbyCFRegular})`
   }},
   {'@font-face':{
      fontFamily: "visbyCFBold",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${visbyCFBold})`
   }},
   {'@font-face':{
      fontFamily: "visbyCFExtraBold",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${visbyCFHeavy})`
   }},
   {'@font-face':{
      fontFamily: "visbyCFHeavy",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${visbyCFExtraBold})`
   }},
   {'@font-face':{
      fontFamily: "montserratRegular",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${montserratRegular})`
   }},
   {'@font-face':{
      fontFamily: "poppinsRegular",
      fontStyle: 'normal',
      fontWeight: 400,
      src: `url(${poppinsRegular})`
   }}
]

//we'll break this whole thing up into peices at somepoint
const theme =(palette)=>({
   'palette': palette,
   'mixins': {
      standardFlex: {
         'flex': '1 1 0'
      },
      isolate: {
         'isolation': 'isolate'
      }
   },
   mainMenu: {
      container: {
         height:112,
         position:'absolute',
         top: -112,
         left:0,
         width:'100%',
         background: `linear-gradient(180deg, ${palette.primary.main} 22%, ${tinycolor(palette.primary.main).setAlpha(0)} 138%)`,
         // backgroundColor: 'rgba(9,27,56, 0.5)',
         display:'flex',
         // flexDirection:'column',
         justifyContent:'center',
         alignItems:'center'
      }
   },
   portalPage:{
      sidePanel: {
         position:'absolute',
         left:-951,
         top:0,
         // border: '1px dashed green',
         width: '951px',
         height:'1080px'
      },
      menuItemsContainer: {
         display:'flex',
         flexGrow:1,
         justifyContent: 'center',
         alignItems: 'center',
         textAlign:'center'
      },
      portalMenuItem: {
         boxSizing:'border-box',
         fontSize: '17px',
         fontFamily:'poppinsRegular',
         whiteSpace:'pre-wrap',
         width: '9vw',
         zIndex:1,
         letterSpacing: '-0.35px',
         transition:  ' all 0.2s'
      },
      portalMenuItemSelected: {
         boxSizing:'border-box',
         fontSize: '20px',
         fontFamily: 'poppinsRegular',
         whiteSpace:'pre-wrap',
         width: '9vw',
         textShadow: `3px 3px 20px ${palette.secondary.light}`,
         borderBottom: '3px solid ' + palette.secondary.main,
         position:'relative',
         // top:'-35px',
         letterSpacing: '-0.35px',
         transition:  ' all 0.2s'
      },
      pageContainer: {
         'position': 'absolute',
         'width': '1920px',
         'height': '1080px',
         'background': `radial-gradient(closest-corner at 1541px 219px, ${tinycolor(palette.primary.main).setAlpha(0.8)} 24%, ${palette.common.black} 500%)`
      },
      //WELCOME MESSAGE STYLES
      welcomeHeader: {
         color: palette.secondary.main,
         fontSize:'90px',
         fontFamily: 'visbyCFRegular',
         letterSpacing: "-4.0px",
         lineHeight: '78px',
         paddingBottom: "30px"
      },
      welcomeContainer: {
         position: 'absolute',
         left: '140px',
         top: '190px',
      },
      welcomeName:{
         color: palette.secondary.light,
         fontSize:'59px',
         fontFamily: 'visbyCFRegular'
      },
      welcomeMessage:{
         color:'#FAB99E',
         fontSize:'24px',
         fontFamily: 'visbyCFRegular',
         // fontWeight:'bold',
      },
      webRemoteQR:{
         'position': 'absolute',
         'top': 500,
         'right': 108,
         'height': '150px',
         'width': '400px',
      },
   },
   decorators:{
      currentTemp:{
         verticalAlign: 'middle',
         fontSize:'43px',
         fontFamily: 'poppinsRegular',
         fontWeight: '600',
         paddingRight: '8px',
         color:palette.secondary.main
      },
      currentConditionsContainer: {
         display:'flex',
      },
      currentTimeDateContainer: {
         display:'flex',
         flexDirection: 'column',
         alignItems: 'center',
         textAlign: 'center',
         color:palette.secondary.light
      },
      currentTime:{
         verticalAlign: 'middle',
         fontSize: '29px',
         fontFamily: 'poppinsRegular',
      },
      currentDate:{
         verticalAlign: 'middle',
         fontSize:'17px',
         fontFamily: 'poppinsRegular',
      },
      verticalSeperator:{
         border: '2px solid ' + palette.secondary.light,
         height: '58px',
         marginRight: '24px',
         marginLeft: '24px'
      },
      horizontalSeperator:{
         border: '2px solid ' + palette.secondary.main,
         width: '31px',
         marginTop: '6px',
         marginBottom: '6px'
      },
   },
   guidePage: guideStyles(palette),
   channelBanner: bannerStyles(palette),
   appsPage: applicationStyles(palette),
   adBar: adBarStyles(palette),
   'globals': [
      ...fontFaces,
      {
         'body': {
            margin:'0px',
            // background: palette.background.default,
            color: palette.text.primary,
            fontFamily: 'visbyCFRegular',
            overflow:'hidden',
            background: `url(${weddingBG})`
         },
         '.directTuneDisplay':{
            fontFamily: 'visbyCFBold',
            fontSize: '90px',
            padding:'20px',
            position:'fixed',
            borderBottomRightRadius: '17px',
            background:tinycolor(palette.common.black).setAlpha(0.5).toRgbString()
         },
         // ...guideStyles(palette),
         // ...applicationStyles(palette),
         ...compendiumStyles(palette),
         // ...bannerStyles(palette),
         // ...adbarStyles(palette)
         //add to global overrides here
      }
   ]
})


export default theme