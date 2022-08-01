


class Debugger {
   constructor(){
      this.canvas = undefined;
   }

   connectCanvas(canvas){
      this.canvas = canvas
      var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
      this.canvas.width = 1920 * scale;
      this.canvas.height = 1080 * scale;
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
      this.ctx = this.canvas.getContext("2d");
      this.canvasData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
   }

   // drawNavigation(navItem){
   //    if(navItem.left !== undefined){
   //       this.drawLine(navItem.position.center.x, navItem.position.center.y, navItem.left.position.center.x, navItem.left.position.center.y, 'green');
   //    }

   //    if(navItem.right !== undefined){
   //       this.drawLine(navItem.position.center.x, navItem.position.center.y, navItem.right.position.center.x, navItem.right.position.center.y, 'blue');
   //    }

   //    if(navItem.up !== undefined){
   //       this.drawLine(navItem.position.center.x, navItem.position.center.y, navItem.up.position.center.x, navItem.up.position.center.y);
   //    }

   //    if(navItem.down !== undefined){
   //       this.drawLine(navItem.position.center.x, navItem.position.center.y, navItem.down.position.center.x, navItem.down.position.center.y, 'yellow');
   //    }
   //    this.drawNavPoints(navItem)
   // }

   drawNavigation(navItem){
      if(navItem.left !== undefined){
         let closestPoint = navItem.position.leftBound.closestPointTo(navItem.left.position.midLeft);
         this.drawLine(navItem.position.center, closestPoint, 'green');
      }
      if(navItem.right !== undefined){
         let closestPoint = navItem.position.rightBound.closestPointTo(navItem.right.position.midRight);
         this.drawLine(navItem.position.center, closestPoint, 'blue');
      }

      if(navItem.up !== undefined){
         /////
         let closestPoint = navItem.position.topBound.closestPointTo(navItem.up.position.midBottom);
         this.drawLine(navItem.position.center, closestPoint);
      }

      if(navItem.down !== undefined){
         let closestPoint = navItem.position.bottomBound.closestPointTo(navItem.down.position.midTop);
         this.drawLine(navItem.position.center, closestPoint, 'yellow');
      }
      this.drawNavPoints(navItem)
   }

   drawBoundingRect(navItem, style="#FF1100"){
      let {position} = navItem
      this.drawLine(position.topLeft, position.topRight);
      this.drawLine(position.topLeft, position.bottomLeft);
      this.drawLine(position.bottomRight, position.topRight);
      this.drawLine(position.bottomLeft, position.bottomRight);
   }

   drawNavPoints(navItem, style="#FF0000"){
      //154, 196, 224
      // this.drawPixel(navItem.position.topLeft.x, navItem.position.topLeft.y, 154, 196, 224, 1);
      let {center, midTop, midBottom, midLeft, midRight, topLeft, topRight, bottomLeft, bottomRight } = navItem.position;
      this.drawPoint(center.x, center.y, style);
      this.drawPoint(midTop.x, midTop.y, style);
      this.drawPoint(midBottom.x, midBottom.y, style);
      this.drawPoint(midLeft.x, midRight.y, style);
      this.drawPoint(midRight.x, midRight.y, "pink");
      this.drawPoint(topLeft.x, topLeft.y, 'yellow');
      this.drawPoint(topRight.x,topRight.y, 'green');
      this.drawPoint(bottomLeft.x, bottomLeft.y, 'lightblue');
      this.drawPoint(bottomRight.x, bottomRight.y, 'pink');
   }

   drawPoint(x, y, style="#FF0000"){
      this.ctx = this.canvas.getContext("2d");
      this.ctx.fillStyle = style;
      this.ctx.fillRect(x,y,1,1);
   }

   drawLine(point1, point2, strokeStyle="#FF0000" ){
   // drawLine(fx, fy, tx, ty, strokeStyle="#FF0000" ){
      this.ctx = this.canvas.getContext("2d");
      this.ctx.beginPath();
      this.ctx.moveTo(point1.x, point1.y);
      this.ctx.lineTo(point2.x,point2.y);
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke();
   }

   drawPixel (x, y, r, g, b, a) {
      var index = (x + y * this.canvasWidth) * 4;
      this.canvasData.data[index + 0] = r;
      this.canvasData.data[index + 1] = g;
      this.canvasData.data[index + 2] = b;
      this.canvasData.data[index + 3] = a;
      this.ctx.putImageData(this.canvasData, 0, 0);
  }

  clearCanvas() {
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

export const Debug = new Debugger();