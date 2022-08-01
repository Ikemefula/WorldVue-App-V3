import tinycolor from 'tinycolor2';
import tinygradient from 'tinygradient';
import bannerImage1 from '../../assets/images/bannerCity.png'

const bannerStyles = (palette)=>{
   console.log("PALETTE", palette)
   let grad1 = tinygradient(palette.primary.main, palette.common.black)
   let grad1Colors = grad1.rgb(4)
   console.log(grad1Colors.toString()) 
   return {
      'channelBannerRootContainer': {
         'position': 'absolute',
         'bottom': '-300px',
         'width':'100%',
         'height': '300px',
         'display':'flex',
         'justifyContent': 'center',
         // 'background': 'rgba(0,0,0, 0.1)'
      },
      'channelBannerContentContainer': {
         'boxShadow': `0px 0px 9px 0px ${tinycolor(palette.common.black).setAlpha(0.75)}`,
         'height': '166px',
         'width': '1119px',
         // 'border': '1px dashed darkgreen',
         'borderRadius': '8px',
         'display': 'flex'
      },
      'channelBannerInfoContainer':{
         'display': 'flex',
         'flexGrow': 1,
         'maxWidth': '431px',
         // 'border': '1px dashed darkblue',
         'backgroundImage': 'url('+bannerImage1+')',
         'borderRadius': '8px 0px 0px 8px',
         'backgroundPosition': "-144px -116px",
      },
      'channelBannerInfoOverlay':{
         'display': 'flex',
         'alignItems': 'center',
         // 'justifyContent': 'center',
         'flexGrow': 1,
         'borderRadius': '8px 0px 0px 8px',
         'background': `linear-gradient(180deg, ${grad1Colors[0].setAlpha(0.3)} 0%, ${grad1Colors[2].setAlpha(0.9)} 75%, ${grad1Colors[2]} 119%, ${grad1Colors[3]} 100%)`,
         // 'justifyContent': 'space-evenly'
      },
      'channelBannerDescriptionContainer':{
         'borderRadius': '0px 8px 8px 0px',
         'display': 'flex',
         'flex': ' 1 1 0',
         'background': palette.background.neutral,
         // 'border': '1px dashed darkblue',
         'alignItems': 'center',
         'paddingLeft': '50px'
      },
      'channelBannerProgramName':{
         'fontSize': '30px',
         'color': palette.text.secondary
      },
      'channelBannerProgramDescription':{
         'fontSize': '20px',
         'color': palette.text.secondary
      },
      'channelBannerProgramTimeSlot':{
         'fontSize': '15px',
         'fontFamily': 'visbyCFBold',
         'color': palette.primary.light
      },
      'channelBannerLogicalChannel': {
         'fontSize': '78px',
         'fontfamily': 'visbyCFBold',
         'color': palette.secondary.light,
         'fontWeight': '600',
         'paddingLeft': '35px',
         'width': '100px'
      },
      'channelBannerChannelIconContainer': {
         maxHeight: '78px'
      },
      'channelBannerChannelIcon': {
         maxHeight: '78px',
         maxWidth: '78px'
      },
      'channelBannerBrandLogoContainer':{
         paddingLeft: '24px',
      },
      'channelBannerBrandLogo':{
         width:'149px'
      }
   }
}

export default bannerStyles