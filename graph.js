

var ASCIIDrawing = require('./asciidrawing.js');

function Graph(spaceData) {
	this.spaceData = spaceData;
	this.initGraph(spaceData);
}



// --- Graph variables ---
Graph.prototype.asciiDrawing;

Graph.prototype.title = "Energy usage";
Graph.prototype.subtitle = "";
Graph.prototype.xAxis_label = "Time";
Graph.prototype.xAxis_units = "";
Graph.prototype.xAxis_size = 42;
Graph.prototype.xAxis_origin = 10;
Graph.prototype.yAxis_label = "";
Graph.prototype.yAxis_units = "kWh";
Graph.prototype.yAxis_size = 20;
Graph.prototype.yAxis_origin = 25;

Graph.prototype.dataMax;
Graph.prototype.dataMin;

Graph.prototype.xAxis_fullTimeLabels = true; //if true, display the full date on the x axis

Graph.prototype.fullScale = true; //if true, graph max is 1, min is 0, otherwise min is the minimum value
Graph.prototype.normalizedPoints; //Points from 0-1, where 1 is max
Graph.prototype.graphPoints; //Points in the graph coordinate space (need to be transformed into the drawing space)



// --- Graph functions --- 

//Initialize the graph to the json data:
Graph.prototype.initGraph = function () {
	//At this point we're assuming the spaceData is valid Pulse space data.
	this.yAxis_label = this.spaceData.unit;
	this.title = this.spaceData.label + " (" + this.spaceData.id + ")";
	this.subtitle = this.spaceData.start.split("T")[0] +" "+ this.spaceData.start.split("T")[1].split("-")[1];
	this.subtitle +=" - "
	this.subtitle += this.spaceData.end.split("T")[0] +" "+ this.spaceData.end.split("T")[1].split("-")[1];
	
	//Initialize the graph's data:
	var data = this.spaceData.data;
	//Decide on the size of the graph:
	this.xAxis_size = data.length * ( 5 ) + 2;
	if ( this.xAxis_fullTimeLabels ) {
		this.xAxis_size = data.length * ( 6 ) + 2; //Need a bit extra for the times
	}
	
	//We need to find the maximum and minimum of the data:
	var dataMax = Number.MIN_VALUE;
	var dataMin = Number.MAX_VALUE;
	for (var ii = 0; ii < data.length; ii++ ) {
		// console.log("Investigating "+data[ii][1]);
		if ( data[ii][1] < dataMin ) {
			dataMin = data[ii][1];
		}
		if ( data[ii][1] > dataMax ) {
			dataMax = data[ii][1];
		}
	}
	this.dataMax = dataMax;
	this.dataMin = dataMin;
	// console.log("DATA MIN: "+dataMin+" DATA MAX: "+dataMax);
	
	//Compute normalizedPoints
	this.normalizedPoints = [];
	for (var ii = 0; ii < data.length; ii++ ) {
		if ( this.fullScale ) {
			this.normalizedPoints.push( data[ii][1] / dataMax );
		} else {
			this.normalizedPoints.push( (data[ii][1] - dataMin ) / (dataMax - dataMin ) );
		}
	}
}
//
//Draw Chart Basics, axis, labels, title, etc.
Graph.prototype.drawChartBasics = function () {
	var drawingWidth = this.xAxis_size + this.xAxis_origin + 2;
	var drawingHeight = this.yAxis_origin + 3;
	if ( this.xAxis_fullTimeLabels ) {
		drawingHeight += 5; //Account for the extra space the labels take up
	}
	this.asciiDrawing = new ASCIIDrawing(drawingWidth, drawingHeight);
	
	this.drawAxis();
	
	//Common variables:
	var x,y;
	
	//Draw X axis Labels
	var graph = this;
	var yValue = this.yAxis_origin + 1;
	//Bit of a hack to get some quick time labels into our chart
	function drawXAxisTimePoint ( x, y, ii ) {
		if ( graph.xAxis_fullTimeLabels ) {
			var string = graph.spaceData.data[ii][0];
			var strings = string.split("T")[0].split("-");
			strings = strings.concat(string.split("T")[1].split("-")[1] );
			for (var jj = 0; jj < strings.length; jj++ ) {
				graph.asciiDrawing.drawText(x, yValue+jj, strings[jj]);
			}
		} else {
			graph.asciiDrawing.drawText(x, yValue, graph.getTimeStringAt(ii));
		}
	}
	this.plotChart(drawXAxisTimePoint);
	
	//Draw Y axis labels
	var yAxisLabelWidth = this.xAxis_origin-2;
	var numYLabels = 10;
	var value;
	var string;
	for ( var ii = 0; ii <= numYLabels; ii++ ) {
		y = this.yAxis_origin - Math.round(ii/numYLabels *this.yAxis_size);
		if ( this.fullScale ) {
			value = Math.round( this.dataMax * (ii/numYLabels) );
		} else {
			value = Math.round( (this.dataMax * (ii/numYLabels) ) + (this.dataMin*(1-ii/numYLabels)) );
		}
		string = ""+value;
		x = this.xAxis_origin - string.length;
		this.asciiDrawing.drawText(x, y, string);
	}
	
	//Draw title
	x = this.xAxis_origin + (this.xAxis_size + 1 - this.title.length ) / 2;
	x = Math.round(x);
	y = 0;
	this.asciiDrawing.drawText(x, y, this.title);
	//Subtitle
	x = this.xAxis_origin + (this.xAxis_size + 1 - this.subtitle.length ) / 2;
	x = Math.round(x);
	y = 1;
	this.asciiDrawing.drawText(x, y, this.subtitle);
	//X axis label
	x = this.xAxis_origin + Math.round((this.xAxis_size + 1 - this.xAxis_label.length ) / 2);
	y = this.asciiDrawing.height - 1;
	this.asciiDrawing.drawText(x, y, this.xAxis_label); //Date
	//Draw yAxis_units
	x = this.xAxis_origin - 4;
	y = this.yAxis_origin - this.yAxis_size - 2;
	this.asciiDrawing.drawText(x, y, this.yAxis_units);
	
}
Graph.prototype.getTimeStringAt = function ( ii ) {
	var string = this.spaceData.data[ii][0];
	string = string.split("T")[0].split("-")[2];
	return string;
}







//Plot a bar chart
Graph.prototype.plotBarChart = function () {
	var barChartSymbol = '#'.green;
	this.drawChartBasics();
	//Closure to draw a type of graph:
	var graph = this;
	function drawingFunction ( x, y ) {
		// console.log("Graph - drawPoint '"+x+","+y+"':");
		if ( y < graph.yAxis_origin-1 ) {
			graph.asciiDrawing.drawLine(x, y, x, graph.yAxis_origin, barChartSymbol);
		} else {
			graph.asciiDrawing.drawPoint(x, y, barChartSymbol);
		}
	}
	this.plotChart(drawingFunction);
}
//Plot a line chart
Graph.prototype.plotLineChart = function () {
	this.drawChartBasics();
	//Closure to draw a type of graph:
	var graph = this;
	var prevX;
	var prevY;
	function drawingFunction ( x, y, ii ) {
		if ( ii != 0 ) {
			graph.asciiDrawing.drawLine(x, y, prevX, prevY, '.'.yellow);
			graph.asciiDrawing.drawPoint(prevX, prevY, '#');//Need to draw over it again
		}
		prevX = x;
		prevY = y;
		if ( y < graph.yAxis_origin-1 ) {
			graph.asciiDrawing.drawLine(x, y, x, graph.yAxis_origin-1, '|'.red);
		}
		graph.asciiDrawing.drawPoint(x, y, '#');
	}
	this.plotChart(drawingFunction);
}
//Plot a point chart
Graph.prototype.plotPointChart = function () {
	this.drawChartBasics();
	//Closure to draw a type of graph:
	var graph = this;
	function drawingFunction ( x, y ) {
		// console.log("Graph - drawPoint '"+x+","+y+"':");
		graph.asciiDrawing.drawPoint(x, y, '*'.yellow);
	}
	this.plotChart(drawingFunction);
}








//Plot a chart using a drawing function.  Drawing function can take in up to three arguments ( x, y, and index )
Graph.prototype.plotChart = function ( drawingFunction ) {
	var xAxisSpacing = Math.round ( (this.xAxis_size-2) / this.normalizedPoints.length );
	var x = this.xAxis_origin+1;
	var xStart = this.xAxis_origin+1 + Math.round(xAxisSpacing/2);
	var y = this.yAxis_origin+1;
	for (var ii = 0; ii < this.normalizedPoints.length; ii++ ) {
		// x = ii * xAxisSpacing + this.xAxis_origin + 1;
		x = ii * xAxisSpacing + xStart;
		y = Math.round( this.normalizedPoints[ii] * this.yAxis_size );
		y = this.yAxis_origin - y;
		drawingFunction(x, y, ii);
	}
}

Graph.prototype.display = function() {
	console.log(this.toString());
}
Graph.prototype.toString = function () {
	return this.asciiDrawing.toString();
}

//Draw the axis
Graph.prototype.drawAxis = function ( ) {
	var ax = this.xAxis_origin;
	var ax_end = this.xAxis_origin + this.xAxis_size;
	var ay = this.yAxis_origin;
	var ay_end = this.yAxis_origin - this.yAxis_size - 1;//The -1 is there to give us the point on top of the graph
	this.asciiDrawing.drawLine( ax, ay, ax_end, ay, "-" ); //Horizontal line
	this.asciiDrawing.drawLine( ax, ay, ax, ay_end, "|" ); //Vertical line
	this.asciiDrawing.drawPoint( ax,ay, "+" ); //Meeting point
	this.asciiDrawing.drawPoint( ax,ay_end, "^" ); //Upper arrow
	this.asciiDrawing.drawPoint( ax_end,ay, ">" ); //Right arrow
}



module.exports = Graph;
