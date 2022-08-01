import React, { useEffect, useCallback, useRef} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import NavItem from '../../components/navigation/NavItem'
import {setFocusItem} from './CompendiumReducer';
import palette from '../../styles/palettes/default';
import anime from 'animejs';
import worldvueIcon from '../../styles/assets/compendium/icon-worldvue.svg?url';
import webremoteIcon from '../../styles/assets/compendium/icon-webremote.svg?url';
import streamingIcon from '../../styles/assets/compendium/icon-streaming.svg?url';
import compendiumIcon from '../../styles/assets/compendium/icon-compendiums.svg?url';
import castingIcon from '../../styles/assets/compendium/icon-casting.svg?url';
import wIcon from '../../styles/assets/compendium/icon-w.svg?url';

const CompendiumPage = (props)=>{

   const onFocus = ()=>{

   }

   return <div className='compendiumPageContainer'>
      <CompendiumItemsContainer transitionState={props.transitionState} />
      <CompendiumContentContainer transitionState={props.transitionState}/>
   </div>
}

const CompendiumItemsContainer = (props)=>{
   return <div className='compendiumMenuItemsContainer'>
      {compendiumConfig.items.map((item)=>{
         return <CompendiumMenuItemContainer key={item.label} item={item}/>
      })}
   </div>
}

const CompendiumMenuItemContainer = (props)=>{
   const dispatch = useDispatch()
   const onFocus = useCallback((item)=>{
      dispatch(setFocusItem(item));
   }, [dispatch]);
   return <NavItem onFocus={onFocus.bind(this, props.item)}>
      <MenuItemContent {...props.item}/>
   </NavItem>
}

const MenuItemContent = (props)=>{
   let className = 'compendiumNavItem'
   if(props.selected){
      className += " selected";
   }
   return <div className={className}>
      <div className='compendiumItemLabel'>
         {props.label}
      </div>
   </div>
}

const CompendiumContentContainer = (props)=>{
   const itemSelected = useSelector((state)=>{
      return state.compendium.focusItem
   })
   console.log("ITEM SELECTED ", itemSelected)
   if(itemSelected === null) return null
   return <div className='compendiumContentRoot'>
      <div id="test" className='compendiumContentContainer'>
         {compendiumConfig.content[itemSelected.id]()}
      </div>
   </div>
}

const compendiumConfig = {
   items: [
      {
         'id': 'welcome',
         'label': 'Welcome',
         'icon': wIcon
      },
      {
         'id': 'worldvue',
         'label': 'WorldVue',
         'icon': worldvueIcon
      },
      {
         'id': 'livestream',
         'label': 'Live Stream',
         'icon': streamingIcon
      },
      {
         'id': 'compendiums',
         'label': 'Digital Compendiums',
         'icon': compendiumIcon
      },
      {
         'id': 'webremote',
         'label': 'Web Remote',
         'icon': webremoteIcon
      },
      {
         'id': 'casting',
         'label': 'Casting',
         'icon': castingIcon
      }
   ],
   content: {
      'welcome': (props)=>{
         return <div>
            <div style={{ color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px'}}>
               <div style={{'fontSize': "40px"}}>
                  <div >WELCOME</div>
                  <div>TO</div>
               </div>
               <div style={{'fontSize':'96px','fontFamily':'visbyCFExtraBold'}}>ORLANDO</div>
            </div>
            <div style={{fontFamily:'visbyCFBold' , color:"#009DFF", 'fontSize': '18px', 'textAlign': 'center'}}>
               <div>Booth ####</div>
               <div>Convention Center</div>
            </div>
            <div style={{paddingTop:'40px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>
               WorldVue is fully customizable to meet and exceed your brand’s expectations and your guests’ desires. Create and maintain the very best experience for your guests – and keep them coming back time and time again.
            </div>
         </div>
      },
      'worldvue': ()=>{
         return <div>
            <div style={{ fontFamily:'visbyCFBold', color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px', 'fontSize': "40px"}}>WorldVue</div>
            <div style={{marginTop: '30px', fontFamily:'visbyCFBold' , color:"#009DFF", 'fontSize': '18px', 'textAlign': 'center'}}>The Ultimate Guest Experience.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>WorldVue is fully customizable to meet and exceed your brand’s expectations and your guests’ desires. Create and maintain the very best experience for your guests – and keep them coming back time and time again</div>
            <div style={{fontFamily:'visbyCFBold', 'paddingLeft': '50px', 'paddingRight': '50px', 'paddingTop': '20px', 'textAlign':'center' }}>Benefits of WorldVue</div>
            <div style={{fontSize: "18px", 'paddingLeft': '50px', 'paddingRight': '50px'}}>
               <ul>
                  <li>WorldVue can use many different paths to the room (Ethernet, WiFi, Cable Model) – the benefit is upgrading an in-room experience without the need to rewire your property.</li>
                  <li>WorldVue opens the door to the world of streaming video applications, which is what guests want.</li>
                  <li>WorldVue integrates with PMS and room controls.</li>
                  <li>WorldVue is the hotel room’s managed gateway to digital transformation.</li>
               </ul>
            </div>
         </div>
      },
      'livestream': ()=>{
         return <div>
            <div style={{ color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px', 'fontSize': "40px"}}>Live Stream</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Whether you are hosting a conference, a wedding, or want to provide guests with workout videos, World Cinema can provide ways to stream your event LIVE directly to guest room televisions.</div>
            <div style={{fontSize: "18px", 'paddingLeft': '50px', 'paddingRight': '50px'}}>
               <ul>
                  <li>Live stream directly from our Event Center onto in-room televisions</li>
                  <li>Available to click and watch through the custom property menu screen</li>
                  <li>Optional passcode protection</li>
                  <li>Multiple events can be streamed at once
                     <ul>
                        <li>Assign channel number</li>
                        <li>Choose name of event</li>
                        <li>Write a description</li>
                        <li>Add an optional password of your choice</li>
                     </ul>
                  </li>
                  <li>24/7 Support</li>
               </ul>
            </div>
         </div>
      },
      'compendiums': ()=>{
         return <div>
            <div style={{ color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px', 'fontSize': "40px"}}>Digital Compendiums</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Digitize hotel information through your own in-house channel. Display your amenities and offers through text, photos and looping videos played on each in-room television screen.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Each property has the opportunity to customize their menu screen effective to what they have available. Show off your spa, restaurants, gym hours, map, amenities, and more – right from your guest’s TV screen.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Creative services available from CarrierWave Creative, by WCI. For more information, contact info@carrierwavecreative.com</div>
         </div>
      },

      'webremote': ()=>{
         return <div>
            <div style={{ color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px', 'fontSize': "40px"}}>Web Remote</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Scan and Connect! The touchless solution keeps your hands off the in-room tv remotes and puts your personal devices in control</div>
            <div style={{fontSize: "18px", 'paddingLeft': '50px', 'paddingRight': '50px'}}>
               <ul>
                  <li>No app downloads</li>
                  <li>No storage needed</li>
                  <li>No touching the TV remote</li>
               </ul>
            </div>
         </div>
      },
      'casting': ()=>{
         return <div>
            <div style={{ color:palette.secondary.light, 'textAlign': 'center', 'marginTop': '40px', 'fontSize': "40px"}}>Casting</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Casting has never been easier. With little equipment required, World Cinema enables guests to cast any content from personal devices directly to guest room televisions.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>Chromecast dongle to be purchased and installed by WCI.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", textAlign: 'center', 'paddingLeft': '50px', 'paddingRight': '50px'}}>WCI can apply overlay to the properties’ current free-to-guest or programming system.</div>
            <div style={{paddingTop:'30px', fontSize: "20px", 'paddingLeft': '50px', 'paddingRight': '50px'}}>
               <ul>
                  <li>Connect to hotel WiFi</li>
                  <li>Visit site specific url</li>
                  <li>Enter room number</li>
                  <li>Confirm and cast</li>
               </ul>
            </div>
         </div>
      }
   }
}

export default CompendiumPage;
