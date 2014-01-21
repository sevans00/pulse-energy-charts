//Strict mode (for now)
"use strict";

//Imports:
var colors = require('./node_modules/colors');
var fs = require('fs');
var Graph = require('./graph.js');



var apiKey = "9C3B13239D75E73FDE883C934FF647A1";
var spaceId = process.argv[2];

console.log("Space ID:",spaceId);




function drawGraph(jsonData) {
	var graph = new Graph(jsonData);
	// graph.plotPointChart();
	graph.plotBarChart();
	// graph.plotLineChart();
	graph.display();
	
}


//Read in some data, convert to JSON, print it out, for great justice
function readSampleData(error, data) {
	if ( error ) {
		console.log("Error:",error);
		return;
	}
	// console.log("Contents of sample:",data);
	var jsonData = JSON.parse(data);
	// console.log("JSON Data:",jsonData);
	//Now we need to plot it:
	// console.log("Draw a graph");
	drawGraph(jsonData);
	
}




fs.readFile("sampleData.txt", readSampleData);
// drawGraph(null);
