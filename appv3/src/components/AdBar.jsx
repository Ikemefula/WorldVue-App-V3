import {useTheme} from '@emotion/react';
import mingleAd from '../styles/assets/images/mingle_ad.png'
import QRCode from 'qrcode.react';
const AdBar = (props)=>{
   let {adBar: adBarStyles} = useTheme();
   return <div css={adBarStyles.adBarRoot}>
      {[...commonAds, ...adGroups[props.persona]].map((item, index)=>{
         return <AdItem key={index+'aditem'} {...item}/>
      })}
   </div>
}

const AdItem =(props)=>{
   let {adBar: adBarStyles} = useTheme();
   let {content, qr, image} = props
   return <div css={adBarStyles.adBarItem}>
      <div css={[adBarStyles.adItemContentContainer, adBarStyles.adContentSection, content.containerStyles]}> 
         <div css={content.titleStyle} >{content.title}</div>
         <div css={content.descriptionStyle}>{content.description}</div>
      </div>
      {props.image.enabled ? <div css={[adBarStyles.adItemImageContainer, adBarStyles.adContentSection, image.containerStyles]}>
          <div css={image.style}/>
      </div> : null}
      {props.qr.enabled ? (<div css={[adBarStyles.adItemQrContainer, adBarStyles.adItemQr, qr.containerStyles]} >
         <div css={qr.headerTextStyle}>
            {qr.headerText}
         </div>
         <div css={{background: 'white', 'padding': '10px'}}>
            <QRCode fgColor={'black'}  size={200} value='www.test.com'/>
         </div>
         <div css={qr.footerTextStyle}>
            {qr.footerText}
         </div>
      </div>): null}
   </div>
}

const commonAds = [
   {
      'size': 'small',
      'enabled': false,
      'content': {
         'title': 'MOBILE REMOTE',
         'titleStyle': (theme)=>({
            paddingTop: '34px',
            fontSize: '33px',
            color: theme.palette.primary.dark,
            fontFamily: 'visbyCFBold'
         }),
         'containerStyles': {
            'maxWidth': '95px'
         },
         'Description': null
      },
      'qr':{
         'enabled': true,
         'url': 'www.demourl.com',
         'footerText': 'SCAN TO PAIR',
         'footerTextStyle': {
            'font': 'normal normal bold 16px/30px visbyCFRegular',
            'letterSpacing': '1.5px'
         },
         'containerStyles':(theme)=>({
            'background': theme.palette.primary.main,
            'paddingLeft': '20px',
            'paddingRight': '20px'
         })
      },
      'image': {
         'enabled': false,
         'url': '',
      }
   }
]

const socialAds = [
   {
      'size': 'large',
      'content': {
         'title': 'WINE TASTING EVENT',
         'titleStyle':(theme)=>({
            paddingTop: '34px',
            fontSize: '33px',
            color: theme.palette.primary.main,
            fontFamily: 'visbyCFBold',
            borderBottom: `3px solid ${theme.palette.primary.main}`,
            maxWidth: '200px',
            alignSelf: 'start'
         }),
         'description': '',
         'descriptionStyle': {
            paddingTop: '20px',
            fontSize: '20px',
            color: 'black',
         }
      },
      'qr':{
         'enabled': true,
         'url': 'www.demourl.com',
         'footerText': 'SCAN FOR EVENT DETAILS',
         'footerTextStyle': {
            'font': 'normal normal bold 16px/30px visbyCFRegular',
            'letterSpacing': '0.5px'
         },
         'containerStyles': {
            'paddingLeft': '20px',
            'paddingRight': '20px'
         }
      },
      'image': {
         'enabled': true,
         'style': {
            'backgroundImage' : `url(${mingleAd})`,
            'backgroundPosition': "340px 0",
            'backgroundSize': '441px',
            'borderRadius': '24px',
            'width': '239px',
            'height': '249px'
         },
         'containerStyles': {
            'paddingRight': '20px'
         },
         'url': ''
      }
   }
]

const businessAds = [
   {
      'size': 'large',
      'content': {
         'title': 'BOOK YOUR MEETING SPACE',
         'titleStyle':(theme)=>({
            paddingTop: '34px',
            fontSize: '33px',
            color: theme.palette.primary.main,
            fontFamily: 'visbyCFBold',
            borderBottom: `3px solid ${theme.palette.primary.main}`,
            maxWidth: '200px',
            alignSelf: 'start'
         }),
         'description': 'Booking your office meeting space today!',
         'descriptionStyle': {
            paddingTop: '20px',
            fontSize: '20px',
            color: 'black',
         }
      },
      'qr':{
         'enabled': true,
         'url': 'www.demourl.com',
         'footerText': 'SCAN FOR DETAILS',
         'footerTextStyle': {
            'font': 'normal normal bold 16px/30px visbyCFRegular',
            'letterSpacing': '0.5px'
         },
         'containerStyles': {
            'paddingLeft': '20px',
            'paddingRight': '20px'
         }
      },
      'image': {
         'enabled': true,
         'style': {
            'content': "'PLACEHOLDER'",
            'width': '239px',
            'height': '249px'
         },
         'containerStyles': {
            'paddingRight': '20px'
         },
         'url': ''
      }
   }
];

const highEndAds = [{
   'size': 'large',
   'content': {
      'title': 'JOIN THE ORLANDO CITY TOUR',
      'titleStyle':(theme)=>({
         paddingTop: '34px',
         fontSize: '33px',
         color: theme.palette.primary.main,
         fontFamily: 'visbyCFBold',
         borderBottom: `3px solid ${theme.palette.secondary.main}`,
         maxWidth: '200px',
         alignSelf: 'start'
      }),
      'description': 'Take a tour of the city!',
      'descriptionStyle': {
         paddingTop: '20px',
         fontSize: '20px',
         color: 'black',
      }
   },
   'qr':{
      'enabled': true,
      'url': 'www.demourl.com',
      'footerText': 'SCAN FOR DETAILS',
      'footerTextStyle': {
         'font': 'normal normal bold 16px/30px visbyCFRegular',
         'letterSpacing': '0.5px'
      },
      'containerStyles': {
         'paddingLeft': '20px',
         'paddingRight': '20px'
      }
   },
   'image': {
      'enabled': true,
      'style': {
         // 'backgroundImage' : `url(${mingleAd})`,
         // 'backgroundPosition': "340px 0",
         // 'backgroundSize': '441px',
         // 'borderRadius': '24px',
         'content': "'PLACEHOLDER'",
         'width': '239px',
         'height': '249px'
      },
      'containerStyles': {
         'paddingRight': '20px'
      },
      'url': ''
   }
}];

const weddingParty = [{
   'size': 'large',
   'content': {
      'title': 'CHECK INTO BRIDAL PARTY',
      'titleStyle':(theme)=>({
         paddingTop: '34px',
         fontSize: '33px',
         color: theme.palette.secondary.main,
         fontFamily: 'visbyCFBold',
         borderBottom: `3px solid ${theme.palette.primary.main}`,
         maxWidth: '200px',
         alignSelf: 'start'
      }),
      'description': 'Join the rehersal dinner ',
      'descriptionStyle': {
         paddingTop: '20px',
         fontSize: '20px',
         color: 'black',
      }
   },
   'qr':{
      'enabled': true,
      'url': 'www.demourl.com',
      'footerText': 'SCAN FOR DETAILS',
      'footerTextStyle': {
         'font': 'normal normal bold 16px/30px visbyCFRegular',
         'letterSpacing': '0.5px'
      },
      'containerStyles': {
         'paddingLeft': '20px',
         'paddingRight': '20px'
      }
   },
   'image': {
      'enabled': true,
      'style': {
         // 'backgroundImage' : `url(${mingleAd})`,
         // 'backgroundPosition': "340px 0",
         // 'backgroundSize': '441px',
         // 'borderRadius': '24px',
         'content': "'PLACEHOLDER'",
         'width': '239px',
         'height': '249px'
      },
      'containerStyles': {
         'paddingRight': '20px'
      },
      'url': ''
   }
}];

const adGroups = {
   'social': socialAds,
   'business': businessAds,
   'highend': highEndAds,
   'wedding': weddingParty,
   'common': commonAds
}


export default AdBar