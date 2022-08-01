import QRCode from 'qrcode.react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import palette from '../styles/palettes/default';
import {api} from '../app/api/monitorApi';
import { useSelector } from 'react-redux';

const WebRemoteQR = (props)=>{
   const dispatch= useDispatch();
   const serialnumber =  useSelector((state)=>{
      return state.hcap.property.serial_number
   })
   const qrUrl = useSelector((state)=>{
      return state.root.qrURL;
   })

   useEffect(()=>{
      if(serialnumber !== undefined){
         dispatch(api.endpoints.getQRToken.initiate(serialnumber));
      }
   }, [serialnumber, dispatch])

   return <div className='webRemoteQR'>
      {qrUrl === null ? null : <QRCode fgColor={palette.primary.main} includeMargin size={150} value={qrUrl}/>}
         <div style={{paddingTop:'10px', fontSize:'40px', fontFamily:'visbyCFBold', color:palette.secondary.main}}>SCAN ME</div>
         <div  style={{paddingTop:'10px', fontSize:'24px', fontFamily:'visbyCFBold', color:palette.secondary.light}}>to experience WorldVue<br/>mobile remote</div>
      </div>
}

export default WebRemoteQR