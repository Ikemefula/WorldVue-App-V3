import React from 'react';
import {Debug} from '../../utils/debugger';
class DebugCanvas extends React.Component {
   constructor(props){
      super(props);
      this.state = {};
      this.ref = React.createRef();
   }

   componentDidMount(){
      let _this = this;
      Debug.connectCanvas(this.ref.current);
   }

   render(){
      return (<canvas ref={this.ref} style={{position:'fixed', top:0, left:0, height:'1080', width:'1920', zIndex:1000}}></canvas>)
   }

}

export default DebugCanvas
