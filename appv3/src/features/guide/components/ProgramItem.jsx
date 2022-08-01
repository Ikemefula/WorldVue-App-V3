//src/features/guide/components/ProgramItem.jsx
// import dayjs from 'dayjs';
import { useDispatch} from 'react-redux';
import styled from '@emotion/styled';
import {css, useTheme} from '@emotion/react'
import NavItem from '../../../components/navigation/NavItem';
import { setActiveChannel, setFocusedProgram } from '../GuideReducer';
import { navigator } from '../../../utils/navigator';
import GuideBuilder from '../../../utils/GuideBuilder';
import { useHistory  } from 'react-router';
import hcapChannel from '../../../utils/hcap/hcapChannel';
const FlexDiv = styled.div`
  display: flex;
  box-sizing: border-box;
`
const ProgramItem = (props)=>{
   const {guidePage} = useTheme();
   const history = useHistory()
   const dispatch = useDispatch()
   const onFocus = ()=>{
      dispatch(setFocusedProgram(props.program));
   }

   const onBoundryHit = (direction) =>{
      if(GuideBuilder.shiftView(direction)){
         //if the view actually shifts.
         navigator.currentFocus.focus(false);
         navigator.currentFocus = null;
      }
   }
   const onSelect = async ()=>{
      try {
         await hcapChannel.changeChannelRFClass1(props.program.logicalChannel);
         dispatch(setActiveChannel(props.program.logicalChannel));
         history.push('/tv');
      }
      catch(err){
         console.log("Error: Selecting channel on guide")
         console.log("Error")
      }
   }

   return <NavItem navkey={props.program.navkey}
                   firstFocus={props.program.firstFocus}
                   onFocus={onFocus}
                   css={guidePage.guideProgramItemContainer}
                   component={FlexDiv}
                   action={{type:"FUNC", func:onSelect}}
                   onBoundryHit={onBoundryHit}
                   >
            <ProgramItemContent {...props}/>
         </NavItem>
}

const ProgramItemContent = (props)=>{
   const {program} = props;
   return <div className={props.className} style={props.selected ? {fontSize:'25px', textShadow: " 0px 0px 4px #FFFFFF", fontFamily:'visbyCFBold', backgroundColor: "rgba(255, 255, 255, 0.05)"}: null}>
      <div css={css({overflow:'hidden', textOverflow:'ellipsis', margin: '0px 30px 0px 30px'})}>{program.title}</div>
   </div>
}


export default ProgramItem