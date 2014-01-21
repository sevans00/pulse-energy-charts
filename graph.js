
//I'm not sure what I want to do with my chart yet, but I know I want to draw one, so let's write some drawing code!
//An ASCII Graph drawing object (characters/strings stored in a 2d array)
function Graph(width, height) {
	this.width = width;
	this.height = height;
	this.initGraph();
}
//A few "static" variables
Graph.BLANK = ' ';
Graph.prototype.initGraph = function() {
	console.log("Initializing a new graph:"+this.width + "," + this.height);
	this.array = new Array(this.width);
	for (var ii = 0; ii < this.array.length; ii++ ) {
		this.array[ii] = new Array(this.height);
		for (var jj = 0; jj < this.array[ii].length; jj++ ) {
			this.array[ii][jj] = Graph.BLANK;
		}
	}
}
Graph.prototype.toString = function () {
	var string = "";
	var ii = 0;
	var jj = 0;
	for (jj = 0; jj < this.height; jj++ ) {
		for (ii = 0; ii < this.width; ii++ ) {
			string += this.array[ii][jj];
		}
		string += '\n';
	}
	return string;
}
Graph.prototype.drawPoint = function ( x, y, character ) {
	if ( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
		console.logError("Graph - drawPoint '"+x+","+y+"' is out of bounds");
	}
	console.log("Graph - drawPoint '"+x+","+y+"':");
	this.array[x][y] = character;
}
//Using Bresenham's algorithm
Graph.prototype.drawLine = function ( x0, y0, x1, y1, character ) {
/*
function line(x0, y0, x1, y1)
   dx := abs(x1-x0)
   dy := abs(y1-y0) 
   if x0 < x1 then sx := 1 else sx := -1
   if y0 < y1 then sy := 1 else sy := -1
   err := dx-dy
 
   loop
     plot(x0,y0)
     if x0 = x1 and y0 = y1 exit loop
     e2 := 2*err
     if e2 > -dy then 
       err := err - dy
       x0 := x0 + sx
     end if
     if x0 = x1 and y0 = y1 then 
       plot(x0,y0)
       exit loop
     end if
     if e2 <  dx then 
       err := err + dx
       y0 := y0 + sy 
     end if
   end loop
*/
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = -1;
	var sy = -1;
	if ( x0 < x1 ) { sx = 1; }
	if ( y0 < y1 ) { sy = 1; }
	var err = dx-dy;
	var e2;
	while(true) {
		this.drawPoint(x0, y0, character);
		if ( x0 == x1 && y0 == y1 ) {
			break;
		}
		e2 = 2*err;
		if ( e2 > -dy ) {
			err = err - dy;
			x0 = x0 + sx;
		}
		if ( x0 == x1 ) {
			this.drawPoint(x0, y0, character);
			break;
		}
		if ( e2 < dx ) {
			err = err + dx;
			y0 = y0 + sy;
		}
	}
}

module.exports = Graph;
