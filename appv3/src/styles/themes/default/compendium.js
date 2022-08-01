// import rightImage from '../../styles/assets/images/blade6.png';
const compendiumStyles =(palette)=>({
   //main page container
   '.compendiumPageContainer':{
      'position': 'absolute',
      'width': '1920px',
      'height': '1080px',
      'background': 'transparent radial-gradient(closest-corner at 1541px 219px, #CBDFF700 24%, #0C36601A 65%, #02214081 197%, #000000 520%) 0% 0% no-repeat padding-box'
   },
   '.compendiumContentRoot':{
      position:'absolute',
      right:951,
      top:0,
      width: '999px',
      height: '1080px',
      // border: '1px dashed white'
   },
   '.compendiumContentContainer':{
      'padding': '60px'
   },
   '.compendiumMenuItemsContainer':{
      // border: '1px dashed black',
      position:'absolute',
      left:0,
      top:879,
      display:'flex',
      flexWrap:'wrap',
      width: '100%',
      height: '164px',
      justifyContent: 'center'
      // background: 'rgba(0,0,0,0.1)'
   },
   '.compendiumNavItem': {
      height:'164px',
      width:'164px',
      marginRight:"10px",
      borderRadius: "17px",
      display:'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(180deg, rgba(9,27,56,1) 22%, rgba(9,27,56, 0.2) 138%)',
      '&.selected':{
         'background': 'linear-gradient(137deg, rgba(255,255,255,0.3) 0%, rgba(243, 114, 38, 0.8) 100%)'
      }
   },
   '.compTest': {
      background:'black'
   },
   '.compendiumItemContentContainer':{
      display:'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'visbyCFBold',
      color: palette.secondary.light
   },
   '.compendiumIconContainer': {
      'height': '70px',
      'width': '70px',
      'borderRadius': '50%',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      background: '#022140',
      marginTop: '20px',
      marginBottom: '20px'
   },
   '.compendiumItemSelected': {
      height:'4px',
      width: '100px',
      // borderRadius:'50%',
      // background:palette.secondary.main
   },
   '.compendiumContentBackground':{
      position:'absolute',
      top: '221px',
      left: '398px',
      width: '522px',
      height: '610px',
      background: '#783c17 0% 0% no-repeat padding-box',
      mixBlendMode: 'color',
      border: '1px solid #707070',
      borderRadius: '8px',
      opacity: 0.9,
      zIndex:100
   },
   '.compendiumContentSection':{
      position:'absolute',
      top: '221px',
      left: '398px',
      width: '522px',
      height: '610px',
      opacity: 1,
      zIndex:101
   },
   '.compendiumItemLabel':{
      'fontFamily': 'visbyCFBold',
      'fontSize': '17px',
      'color': '#FFD295',
      'textAlign': 'center'
   } 

})

export default compendiumStyles