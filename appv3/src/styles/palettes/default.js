import tinycolor from "tinycolor2"

// import tinycolor from "tinycolor2"
const secondaryOrange = 'rgba(255, 79, 0, 1)';
const primaryBlue= 'rgba(2, 33, 64, 1)';
// const tertiary = ''


const palette = {
   "common": {
      "black": "#000",
      "white": "#fff"
   },
   "background": {
      "default":"rgba(0,0,0,0.5)",
      "neutral": '#E8E5DE'
   },
   "primary": {
      "light": tinycolor(primaryBlue).lighten(20).toRgbString(),
      "main": primaryBlue,
      "dark": tinycolor(primaryBlue).darken(20).toRgbString(),
   },
   "secondary": {
      "light": tinycolor(secondaryOrange).lighten(30).toRgbString(),
      "main": secondaryOrange,
      "dark": tinycolor(secondaryOrange).darken(30).toRgbString()
   },
   "error": {
      "light": "#e57373",
      "main": "#f44336",
      "dark": "#d32f2f",
   },
   "outlines":{
      'main': '#5C5C5C',
      'dark': 'rgba(64,64,64,.6)',
      'field': 'rgba(224,224,224,.3)',
      'button': 'rgba(224,224,224,.9)',
      'disabled':'rgba(224,224,224,.6)'
   },
   "text": {
      "primary": "rgb(255, 255, 255)",
      "secondary":   "#5F5F5F",
      "disabled":  "rgba(255, 255, 255, 0.5)",
      "hint": "rgba(255, 255, 255, 0.5)",
      "bright": "rgb(255, 255, 255)"
   },
   "status":{
      'green': '#3E8E41',
      'blue': '##2864B8',
      'yellow': "#DEB252",
      'grey': 'rgb(74 74 74)'
   }
}

export default palette