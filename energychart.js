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
	var graph = new Graph(20, 20);
	graph.drawPoint(0, 1, "@".green);
	console.log("Graph:\n"+graph.toString());
	graph.drawLine( 1, 5, 10, 17, "#".red);
	console.log("Graph: \n"+graph.toString());
	
}


//Read in some data, convert to JSON, print it out, for great justice
function readSampleData(error, data) {
	console.log("Error:",error);
	console.log("Contents of sample:",data);
	var jsonData = JSON.parse(data);
	console.log("JSON Data:",jsonData);
	//Now we need to plot it:
	
	//Colors!  Yay!
	console.log("asdf".green,"fdsa".red);
	//Char code Graphics?
	// for (var ii = 0; ii < 500; ii++ ) {
		// console.log( ii+" = '" + String.fromCharCode(ii) + "'" );
	// }
	console.log("Draw a graph");
	drawGraph(jsonData);
}




// fs.readFile("sampleData.txt", readSampleData);
drawGraph(null);
