const adBarStyles = (palette)=>({
   'adBarRoot':{
      'position': 'absolute',
      'height': '367px',
      'width': '100%',
      'top': '711px',
      // 'border': '1px dashed white',
      'display': 'flex',
      'justifyContent': 'start',
      'paddingLeft': '140px',
   },
   'adBarItem': {
      "display": "flex",
      "height": '304px',
      // 'border': '1px dashed lightblue',
      "marginRight": '10px',
      'borderRadius': '24px'
   },
   'ad-bar-item-xs':{
      'width': '536px'
   },
   'ad-bar-item-sm':{
      'width': '536px'
   },
   'ad-bar-item-lg':{
      'width': '815px'
   },
   'adContentSection':{
      'flexGrow': 1
   },
   //CONTENT
   'adItemContentContainer': {
      'background': 'rgba(255,255,255,0.3)',
      'borderRadius': '24px 0px 0px 24px',
      'display':  'flex',
      'flexDirection': 'column',
      'alignItems': 'center',
      'maxWidth': '230px',
      'paddingLeft': '24px',
      'paddingRight': '24px'

   },
   //IMAGE
   'adItemImageContainer': {
      'flexGrow': 1,
      'display':'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'background': 'rgba(255,255,255,0.3)'
   },
   'ad-item-image':{

   },
   //QR
   'adItemQrContainer':{
      'background': palette.secondary.light,
      'display': 'flex',
      'flexDirection': 'column',
      'justifyContent': 'center',
      'alignItems': 'center',
      'borderRadius': '0px 24px 24px 0px',
   },
   'adItemQr':{
      'height': ''
   },

})

export default adBarStyles