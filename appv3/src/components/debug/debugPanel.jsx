import React from 'react';
import {css} from '@emotion/react';
import { useSelector, shallowEqual} from 'react-redux';
import hcap from '../../utils/hcap/hcap'

const DebugPanel  = (props)=>{
   const data = useSelector((state)=>{
      return {
         'mode': state.root.mode,
         'socketState': state.hcap.socketState
      }
   }, shallowEqual)
   return <div css={css({background: "black"})}>
      <div>mode: {data.mode}</div>
      <div>hcap socket: {data.socketState}</div>
      <div>hcap isDev: {hcap.wci.isDev().toString()}</div>
   </div>
}

export default DebugPanel