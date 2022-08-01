import tinycolor from 'tinycolor2';
import tinygradient from 'tinygradient';
import guidePangelImage from '../../assets/images/guidePanelCity.png';
// import image from '../assets/images/guideInfoBackground.png';


const guideStyles = (palette)=>{
   console.log("PALETTE", palette)
   let grad1 = tinygradient(tinycolor(palette.primary.light), tinycolor(palette.primary.main));
   let grad1Colors = grad1.rgb(4);
   let grad2 = tinygradient(tinycolor(palette.primary.main), tinycolor('rgba(0, 0, 0, 1'));
   let grad2Colors = grad2.rgb(4);
   console.log('GUIDE GRAD: ', grad1Colors.toString()) 
   return {
      guideProgramItem:{
         'display':'flex',
         'justifyContent':'center',
         'alignItems': 'center',
         'fontSize': '20px',
         'whiteSpace': 'nowrap',
         'overflow': 'hidden',
         'textOverflow':'ellipsis'
      },
      guideContainer: {
         // 'background': palette.primary.main,
         'zIndex': 1
      },
      //main page container
      guideMainContainer:{
         'position':'absolute',
         'display': 'flex',
         'marginBottom':'10px',
         'height': '1080px',
         'width': '1920px',
         'background': `radial-gradient(closest-corner at 1565px 148px, ${grad1Colors[0].setAlpha(0)} 0%, ${grad1Colors[1].setAlpha(0)} 102%, ${grad1Colors[2].setAlpha(0.76)} 187%, ${grad1Colors[3]} 228%)`
      },
      //program information styles
      programInformationContainer:{
         'zIndex': 1,
         'position': 'absolute',
         'left': '-960px',
         'width':"960px",
         'background': `linear-gradient(259deg, ${grad2Colors[0].setAlpha(0.75)} 0%, ${grad2Colors[1]} 25%, ${grad2Colors[2]} 68%, ${grad2Colors[3]} 100%)`,
      },
      programInforamtionBackground: {
         'position': 'absolute',
         'backgroundImage': `url("${guidePangelImage}")`,
         'mixBlendMode': 'lighten',
         'height': 1080,
         'opacity': 0.2,
         'zIndex': 1,
         'width': '960px',
      },
      programInfoContainer: {
         'width': '960px',
         'isolation': 'isolate',
         'background': `linear-gradient(90deg, ${tinycolor(palette.primary.light).setAlpha(0)} 0%, ${palette.primary.main} 100%)`,
         // 'box-shadow': 'inset 0px 3px 6px #00000029',
         'height': 1080,
         'zIndex': 2
      },
      programInfoContent: {
         'paddingTop': '109px',
         'paddingLeft': '140px'
      },
      programTitle:{
         fontFamily: 'visbyCFHeavy',
         fontSize: '72px',
         letterSpacing: '-2.88px',
         color: palette.secondary.main,
      },
      programLogicalName:{
         fontFamily: 'visbyCFBold',
         fontSize: '48px',
         color: palette.secondary.light,
      },
      programTimeSlot:{
         display: "flex",
         justifyContent: "space-between",
         fontSize: '24px',
         paddingBottom: '10px',
         paddingTop: '10px',
         fontFamily: 'visbyCFBold',
         color: palette.primary.verylight
      },
      programDescription:{
         fontSize: '20px',
         fontFamily: 'visbyCFRegular',
         fontWeight: '500'
      },
      //guide grid styles
      guideGridContainer:{
         'position':"absolute",
         'height': "500px",
         'width': '1920px',
         'zIndex': 4,
         'bottom': '-500px',
         // 'background': 'rgba(255,255,255,0.3)'
         // 'border': "1px dashed lightgreen"
      },
      gridItemContainer: {
         flex: '1 1 0',
      },
      guideDivider: {
         background: palette.secondary.light,
         width:'5px',
         // margin: '90px 50px 90px 0px'
      },
      guideTimeSlot:{
         flex: '1 1 0',
         'borderBottom': '1px solid ' + palette.common.black,
         'display':'flex',
         'justifyContent':'left',
         'alignItems': 'center',
         'background': 'linear-gradient(100deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0)  100%)',
         'fontSize':'24px',
         'fontFamily': 'poppinsRegular',
         'fontWeight': 'bold',
         'color': palette.secondary.light,
         'paddingLeft': '15px'
      },
      guideProgramItemContainer:{
         'color': 'white',
         'fontSize': '24px',
         'borderRight': '1px solid rgba(1, 23, 46, 0.6)',
         'borderBottom':'1px solid rgba(1, 23, 46, 0.6)' ,
         'boxSizing': 'border-box',
         'background': 'rgba(255,255,255,0.3)',
         "&:last-child":{
            'borderRight': 'none'
         }
      },
      guideProgramItemContainerSelected:{
         'color': 'white',
         'borderRight': '1px solid rgba(1, 23, 46, 0.6)',
         'borderBottom':'1px solid rgba(1, 23, 46, 0.6)' ,
         'boxSizing': 'border-box',
         // 'backgroundColor': palette.primary.main,
         "&:last-child":{
            'borderRight': 'none'
         }
      },
      //channel name / logical / channel icon that appeas in the first row
      guideChannelName: {
         'isolation': 'isolate',
         'display':'flex',
         'flexDirection': 'column',
         'justifyContent':'space-between',
         'padding': '15px 0px',
         'alignItems': 'center',
         'backdropFilter': 'blur(26px)',
         'background': 'transparent linear-gradient(225deg, rgba(28, 30, 34, .9) -9%, rgba(33, 36, 39, .9) 67%, rgb(44 44 44 / 90%) 100%) 0% 0% no-repeat padding-box'
      },
      guideIconContainer:{
         'height':'20px',
         'padding': '10px 10px'
      },
      guideIconImg:{
         height:'100%',
         maxWidth: '90px'
      },
      guideDayDate:{
         alignItems: 'center',
         display: 'flex',
         justifyContent: 'center',
         fontSize: '16px',
         fontFamily: 'poppinsRegular',
         fontWeight:'bold',
         color: palette.secondary.light
      }
   }
}

export default guideStyles