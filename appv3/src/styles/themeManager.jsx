import merge from 'lodash.merge';
import cloneDeep from 'lodash.cloneDeep';
import themes from './themes';
import palettes from './palettes';

export const getTheme = (theme='default', palette='default')=>{
   console.log("GET THEME: " + theme);
   console.log("GET PALETTE: " + palette);
   let themeObject = cloneDeep(themes['default'](palettes[palette]))
   if(theme !== 'default'){
      themeObject = merge(themeObject, themes[theme](palettes[palette]))
   }
   return themeObject
}

