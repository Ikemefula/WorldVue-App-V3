//src/components/navigation/NavItem.jsx
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {navigator} from '../../utils/navigator';
import { useHistory } from 'react-router';

let autoReflowDebouncer = null //a very short debounce timeout
const autoReflow = ()=>{
   if(autoReflowDebouncer !== null){
      clearTimeout(autoReflowDebouncer);
      autoReflowDebouncer = null
   }
   autoReflowDebouncer = setTimeout(()=>{
      navigator.flow();
   }, 50);
}

const NavItem = function(props){
   const [selected, setSelected] = useState(false)
   const history = useHistory();
   let navElement = useRef();
   const setFocus = useCallback((isFocused)=>{
      if(isFocused){
         if(props.onFocus !== undefined){
            props.onFocus()
         }
         setSelected(isFocused)
      }
      else{
         setSelected(isFocused)
         if(props.onBlur !== undefined){
            props.onBlur();
         }
      }
   }, [])

   const onSelect = useCallback(()=>{
      if(props.action){
         if(props.action.type === 'GOTO'){
            history.push(props.action.route)
         }
         else if (props.action.type === 'FUNC'){
            props.action.func();
         }
      }
   }, [props, history])

   const onBoundryHit= useCallback((direction)=>{
      if(props.onBoundryHit !== undefined){
         props.onBoundryHit(direction)
      }
   }, [])

   const {navkey, firstFocus} = props
   useEffect(()=>{
      navigator.connectItem(navElement, {"navkey":navkey, "firstFocus": firstFocus}, setFocus, onSelect, onBoundryHit)
      autoReflow()
      return ()=>{
         navigator.disconnectItem(navkey);
         autoReflow()
      }
   }, [navkey])

   useEffect(()=>{
      navigator.updateItem(navkey, {"firstFocus": firstFocus})
   }, [props.firstFocus])

   let NavComponent = 'div'
   if(props.component !== undefined){
      NavComponent = props.component
   }
   return <NavComponent ref={navElement} className={props.className}>
      {React.cloneElement(props.children, {selected: selected})}
   </NavComponent>
}

export default NavItem
//    600 599