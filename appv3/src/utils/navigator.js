// src/utils/navigator.js
import {Debug} from './debugger';
import ElementPosition from './ElementGeometry';
import logger from './logger';
// import { debug } from 'util';
class Navigator {
   constructor(){
      this.navItems = [];
      this.needReflow = false;
      this.currentFocus = null;
      this.history = null
      this.debug = false;
   }

   init(){
      // sets first focus
      for(let item of this.navItems){
         if(item.firstFocus){
            this.currentFocus = item
            item.focus(true);
            return;
         }
      }
      // if no item has the first focus then set focus to first item in the array.
      if(this.navItems.length === 0) return;
      this.navItems[0].focus(true);
      this.currentFocus = this.navItems[0];
   }

   flow(force){
      let t1 = performance.now()
     
      if((!this.needReflow || this.navItems.length === 0) && !force){
         if(this.debug && this.navItems.length === 0){
            Debug.clearCanvas() // clear the debug canvas because there isn't anything there
         }
         return;
      }
      for(let refresh_item of this.navItems){
         refresh_item.position.refresh(); //recalc positions incase they've moved
      }
      //sets the directional behavior for each nav item
      for(let item of this.navItems){
         if(this.debug){
            Debug.clearCanvas()
            Debug.drawBoundingRect(item);
         }
         let toRight = []; // list of items to the right
         let rightDist = [];
         let toLeft = [];  // list of items to the left
         let leftDist = [];
         let toAbove = []; // list of items to above
         let aboveDist = [];
         let toBelow = []; // list of items below
         let belowDist = [];
         for(let i of this.navItems){
            if(item === i){
               // this is the current processing item skip
               continue;
            }

            if(i.position.midRight.isLeftOf(item.position.midLeft)){
               //to the left
               toLeft.push(i);
               leftDist.push(i.position.rightBound.closestDistanceTo(item.position.center));
               // leftDist.push(i.position.midRight.distanceTo(item.position.center));
               if(this.debug){
                  let n_point = i.position.rightBound.closestPointTo(item.position.center);
                  Debug.drawLine(item.position.center, n_point, 'green');
               }
            }
            if(i.position.midLeft.isRightOf(item.position.midRight)){
               //to the right
               toRight.push(i);
               rightDist.push(i.position.leftBound.closestDistanceTo(item.position.center));
               // rightDist.push(distanceToRight);
               if(this.debug){
                  let n_point = i.position.leftBound.closestPointTo(item.position.center);
                  Debug.drawLine(item.position.center, n_point, 'blue');
               }
            }

            if(i.position.midBottom.isAbove(item.position.midTop)){
               toAbove.push(i);
               // aboveDist.push(item.position.topBound.closestDistanceTo(i.position.midBottom));
               aboveDist.push(i.position.bottomBound.closestDistanceTo(item.position.center));
               // aboveDist.push(i.position.midBottom.distanceTo(item.position.center));
            }
            if(i.position.midTop.isBelow(item.position.midBottom)){
               //is below
               toBelow.push(i);
               belowDist.push(i.position.topBound.closestDistanceTo(item.position.center));
               // belowDist.push(i.position.midTop.distanceTo(item.position.center));
               if(this.debug){
                  let n_point = i.position.topBound.closestPointTo(item.position.center);
                  Debug.drawLine(item.position.center, n_point, 'yellow');
               }
            }
         }

         let rightIndex = undefined;
         let leftIndex = undefined;
         let belowIndex = undefined;
         let aboveIndex = undefined;
         let lowestR = undefined;
         let lowestL = undefined;
         let lowestB = undefined;
         let lowestA = undefined;

         //determine closest to the right
         for(let j = 0; j < rightDist.length; j++){
            if(rightDist[j] < lowestR || lowestR === undefined){
               lowestR = rightDist[j];
               rightIndex = j;
            }
         }

         //determine closest to the left
         for(let j = 0; j < leftDist.length; j++){
            if(leftDist[j] < lowestL || lowestL === undefined){
               lowestL = leftDist[j];
               leftIndex = j;
            }
         }

         //determine closest to the above
         for(let j = 0; j < aboveDist.length; j++){
            if(aboveDist[j] < lowestA || lowestA === undefined){
               lowestA = aboveDist[j];
               aboveIndex = j;
            }
         }

         //determine closest to the below
         for(let j = 0; j < belowDist.length; j++){
            if(belowDist[j] < lowestB || lowestB === undefined){
               lowestB = belowDist[j];
               belowIndex = j;
            }
         }

         item.right = toRight[rightIndex];
         item.left = toLeft[leftIndex];
         item.up = toAbove[aboveIndex];
         item.down = toBelow[belowIndex];
      }

      this.needReflow = false;
      let t2 = performance.now();
      logger.log("Reflow performance: " + (t2 - t1))
      if(!this.currentFocus){
         this.init();
      }
      if(this.debug){
         this.generateDebugOverlay();
      }
   }

   move(direction){
      if(this.currentFocus === undefined || this.currentFocus === null) return //this happens when moving very fast.
      if(this.currentFocus[direction] === undefined){
         //boundry hit
         if(this.currentFocus.boundryHit){
            this.currentFocus.boundryHit(direction);
         }
         return
      }
      this.currentFocus.focus(false);
      this.currentFocus[direction].focus(true);
      this.currentFocus = this.currentFocus[direction];
   }

   select(){
      this.currentFocus.select();
   }

   back(){
      this.history.goBack()
   }

   exit(){
      this.history.push('/')
   }

   gotoPage(path){
      this.history.push(path)
   }
   // connectItems(items){
   //    for(let item of items){
   //       // let x = item.props.ref.current.offsetLeft;
   //       // let y = item.props.ref.current.offsetTop;
   //       // let height = item.props.ref.current.clientHeight;
   //       // let width = item.props.ref.current.clientWidth;
   //       // let centerX = x + width/2;
   //       // let centerY = y + height/2;
   //       // Debug.drawPoint(centerX, centerY);
   //    }
   // }
   updateItem(navkey, updateData){
      for(let i = 0; i < this.navItems.length; i++){
         if(this.navItems[i].navkey === navkey){
            this.navItems[i] = {...this.navItems[i], ...updateData}
         }
      }
   }

   connectItem(navElement, properties, focusCallback, onSelect, onBoundryHit){
      let {firstFocus, navkey} = properties
      let navItem = {
         element: navElement,
         navkey: navkey,
         position: new ElementPosition(navElement),
         up: undefined,
         left: undefined,
         right: undefined,
         down: undefined,
         focus: focusCallback,
         select: onSelect,
         boundryHit: onBoundryHit,
         firstFocus: firstFocus 
      }
      if(this.debug){
         Debug.drawNavPoints(navItem);
      }
      this.navItems.push(navItem);
      this.needReflow = true;
   }

   disconnectItem(navkey){
      for(let i = 0; i < this.navItems.length; i++){
         if(this.navItems[i].navkey === navkey){
            if(this.currentFocus === this.navItems[i]){
               this.currentFocus = undefined;
            }
            this.navItems[i] = undefined;
            this.navItems.splice(i,1);
            if(this.navItems.length === 0){
               this.currentFocus = undefined;
            }
            this.needReflow = true;
            return;
         }
      }
   }

   generateDebugOverlay(){
      Debug.clearCanvas();
      for(var item of this.navItems){
         Debug.drawNavigation(item);
      }
   }

}

export const navigator = new Navigator();