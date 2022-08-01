
const theme = (palette)=>({
   palette: palette,
   mixins: {},
   mainMenu:{
      container:{
         background: "linear-gradient(5deg, rgba(224, 180, 142, 0.1) 4%, rgba(208, 191, 140, 0.8) 65%, rgba(158, 181, 163, 1) 105%)"
      }
   },
   portalPage: {
      welcomeHeader: {
         color: palette.secondary.main,
      },
      pageContainer: {
         'background': 'radial-gradient(farthest-corner at 2087px -300px, rgba(220, 229, 229, 0.3) 27%, rgba(220, 214, 221,  0.33) 48%, rgba(219, 215, 180, 0.7) 66%, rgb(252, 242, 210, 1) 175%)'
      },
   },
   decorators:{
      currentTemp:{
         color: palette.secondary.main
      },
   },
   guidePage:{
      guideProgramItemContainer: {
         'color': palette.common.black
      },
      guideTimeSlot: {
         'color': palette.secondary.main
      }
   },
   channelBanner: {
      channelBannerProgramTimeSlot:{
         'fontSize': '15px',
         'fontFamily': 'visbyCFBold',
         'color': palette.primary.dark
      },
   },
   appsPgae: {},
   adBar: {},
   globals:{}
})

export default theme