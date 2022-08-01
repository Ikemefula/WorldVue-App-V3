import tinycolor from "tinycolor2"

const primaryDarkGreen = 'rgba(12, 79, 78, 1)'
const secondary = 'rgba(215, 194, 176, 1)'

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
      "light": tinycolor(secondary).lighten(20).toRgbString(), //light orange
      "main": secondary,
      "dark": tinycolor(secondary).darken(30).toRgbString(),
   },
   "secondary": {
      "light": tinycolor(primaryDarkGreen).lighten(10).toRgbString(),
      "main": primaryDarkGreen,
      "dark": tinycolor(primaryDarkGreen).darken(20).toRgbString(),
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
