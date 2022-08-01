class ElementGeometry {
   constructor(element){
      //element is a dom object
      this.element = element.current
      this.rect = this.element.getBoundingClientRect();
      this.height = null 
      this.width = null 
      this.center = null;
      this.midTop = null;
      this.midBottom = null;
      this.midLeft = null;
      this.midRight = null;
      this.topLeft = null;
      this.topRight = null;
      this.bottomLeft = null;
      this.bottomRight = null;
      this.topBound = null;
      this.bottomBound = null;
      this.leftBound = null;
      this.rightBound = null;
      this.setPoints();
      this.setBoundryLines()
   }

   refresh(){
      this.rect = this.element.getBoundingClientRect();
      this.setPoints();
      this.setBoundryLines();
   }

   setPoints(){
      this.height = this.rect.height;
      this.width = this.rect.width;
      this.clientHeight= this.element.clientHeight;
      this.clientWidth = this.element.clientWidth;
      let x = this.rect.left;
      let y =  this.rect.top;

      //corners
      this.topLeft = new Point(x,y);
      this.topRight = new Point(x + this.width, y);
      this.bottomLeft = new Point(x , y + this.height);
      this.bottomRight = new Point(x+ this.width, y+ this.height,);
      //midpoints
      this.midTop = this.topLeft.midpointTo(this.topRight);
      this.midBottom = this.bottomLeft.midpointTo(this.bottomRight);
      this.midLeft = this.topLeft.midpointTo(this.bottomLeft);
      this.midRight = this.topRight.midpointTo(this.bottomRight);
      //center
      this.center = new Point(x + this.width/2, y + this.height/2);
   }

   setBoundryLines(){
      this.topBound = new Line(this.topLeft, this.topRight)
      this.bottomBound = new Line(this.bottomLeft, this.bottomRight)
      this.leftBound = new Line(this.topLeft, this.bottomLeft)
      this.rightBound = new Line(this.topRight, this.bottomRight)
   }
}

class Line{

   constructor(point1, point2){
      this.p1 = point1
      this.p2 = point2
   }

   closestDistanceTo(point){
      //given an point, calculate the distance to the nearest point on the line.
      var A = point.x - this.p1.x;
      var B = point.y - this.p1.y;
      var C = this.p2.x - this.p1.x;
      var D = this.p2.y - this.p1.y;

      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;
      if (len_sq !== 0) //in case of 0 length line
          param = dot / len_sq;

      var xx, yy;

      if (param < 0) {
        xx = this.p1.x;
        yy = this.p1.y;
      }
      else if (param > 1) {
        xx = this.p2.x;
        yy = this.p2.y;
      }
      else {
        xx = this.p1.x + param * C;
        yy = this.p1.y + param * D;
      }

      var dx = point.x - xx;
      var dy = point.y - yy;
      return Math.sqrt(dx * dx + dy * dy);
   }

   closestPointTo(point){
      var A = point.x - this.p1.x;
      var B = point.y - this.p1.y;
      var C = this.p2.x - this.p1.x;
      var D = this.p2.y - this.p1.y;

      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;
      if (len_sq !== 0) //in case of 0 length line
          param = dot / len_sq;

      var xx, yy;
      if (param < 0) {
        xx = this.p1.x;
        yy = this.p1.y;
      }
      else if (param > 1) {
        xx = this.p2.x;
        yy = this.p2.y;
      }
      else {
        xx = this.p1.x + param * C;
        yy = this.p1.y + param * D;
      }
      return new Point(xx, yy)
   }

}


class Point{
   constructor(x,y){
      this.x = x;
      this.y = y;
   }

   distanceTo(other_coordinate){
      let dx = Math.pow(this.x - other_coordinate.x, 2);
      let dy = Math.pow(this.y - other_coordinate.y, 2);
      return Math.sqrt(dx + dy);
   }

   midpointTo(other_coordinate){
      let mid_x = (this.x + other_coordinate.x) / 2
      let mid_y = (this.y + other_coordinate.y) / 2
      return new Point(mid_x, mid_y);
   }

   isLeftOf(other_coordinate){
      return this.x <= other_coordinate.x
   }

   isRightOf(other_coordinate){
      return this.x >= other_coordinate.x
   }

   isAbove(other_coordinate){
      return this.y <= other_coordinate.y
   }

   isBelow(other_coordinate){
      return this.y >= other_coordinate.y
   }
}

export default ElementGeometry