

var ASCIIDrawing = require('./asciidrawing.js');

function Graph(spaceData) {
	var width = 60;
	var height = 20;
	ASCIIDrawing.call(this, width, height);
	this.spaceData = spaceData;
	this.initGraph(spaceData);
}
//Inherit from ASCIIDrawing
Graph.prototype = new ASCIIDrawing();
//Correct constructor pointer
ASCIIDrawing.prototype.constructor = Graph;

// --- Graph variables ---
Graph.prototype.title = "";
Graph.prototype.xAxis_label = "Date";
Graph.prototype.xAxis_units = "";
Graph.prototype.xAxis_size = 60;
Graph.prototype.yAxis_label = "";
Graph.prototype.yAxis_units = "";
Graph.prototype.yAxis_size = 20;

Graph.prototype.graphPoints; //Points in the graph coordinate space (need to be transformed into the drawing space)



// --- Graph functions --- 

//Initialize the graph to the json data:
Graph.prototype.initGraph = function () {
	//At this point we're assuming the spaceData is valid Pulse space data.
	console.log("ID: "+this.spaceData.id);
	console.log("Label: "+this.spaceData.label);
	console.log("Unit: "+this.spaceData.unit);
	console.log("Quantity: "+this.spaceData.quantity);
	console.log("resource: "+this.spaceData.resource);
	console.log("start: "+this.spaceData.start);
	console.log("end: "+this.spaceData.end);
	console.log("data: "+this.spaceData.data);
	
	console.log("-------------------------");
	//Iterate through everything in the object:
	for ( var property in this.spaceData ) {
		console.log(property+" = "+this.spaceData[property]);
	}
	
	console.log("data.length: "+this.spaceData.data.length);
	var data = this.spaceData.data;
	var dataPoints = [];
	var splitData;
	for (var ii = 0; ii < data.length; ii++ ) {
		console.log( data[ii] );
		// splitData = data[ii].split(',');
		// dataPoints[ii] = [splitData[0], splitData[1]];
	}
	
	//We need to find the maximum and minimum of the data:
	var dataMax = Number.MIN_VALUE;
	var dataMin = Number.MAX_VALUE;
	for (var ii = 0; ii < data.length; ii++ ) {
		console.log("Investigating "+data[ii][1]);
		if ( data[ii][1] < dataMin ) {
			dataMin = data[ii][1];
		}
		if ( data[ii][1] > dataMax ) {
			dataMax = data[ii][1];
		}
	}
	console.log("DATA MIN: "+dataMin+" DATA MAX: "+dataMax);
	
	
	
	
	//Now all we need to do is map the data to the graph:
	
	
	var graphAxisX = 1;
	var graphAxisY = 19;
	
	//Plot the points:
	var x = 0;
	var y = 0;
	var dataPoint;
	for (var ii = 0; ii < data.length; ii++ ) {
		x += 4;
		dataPoint = Number(data[ii][1]);
		dataPoint = (dataPoint/dataMax)*18;
		console.log("DataPoint "+ii+": "+dataPoint);
		y = Math.round(dataPoint);//Graph height
		console.log("Y VALUE "+ii+": "+y);
		y = 18 - y;
		console.log("Marking data point "+data[ii][1]+" at "+x+","+y);
		this.drawPoint(x, y, "*".yellow);
	}
	
	
	
	
	
	this.drawPoint(0, 1, "@".green);
	this.drawAxisAt(graphAxisX, graphAxisY);
	this.drawLine( 2, 5, 10, 17, "#".red);
	this.drawText(5, 19, "HELLO WORLD");
}
//Plot a point chart
Graph.prototype.plotPointChart = function () {
	
	
	
}



Graph.prototype.drawAxisAt = function (ax, ay ) {
	this.drawLine( ax, 0, ax, ay, "|" ); //Vertical line
	this.drawLine( this.width-1, ay, ax, ay, "-" ); //Horizontal line
	this.drawPoint( ax,ay, "+" ); //Meeting point
	this.drawPoint( ax,0, "^" ); //Upper arrow
	this.drawPoint( this.width-1,ay, ">" ); //Right arrow
}



module.exports = Graph;
