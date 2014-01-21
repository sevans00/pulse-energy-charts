//Strict mode (for now)
"use strict";

//Imports:
var http = require('http');
var colors = require('./node_modules/colors'); //For colors in the graph
var Graph = require('./graph.js');
var fs = require('fs'); //File system for testing using saved text


var apiKey = "9C3B13239D75E73FDE883C934FF647A1";
var spaceId = process.argv[2];

//Function to draw the graph
function drawGraph(jsonData) {
	var graph = new Graph(jsonData);
	//Draw some different charts:
	if ( process.argv.length > 3 ) {
		switch ( process.argv[3] ) {
			case "-pp" : 
				graph.plotPointChart();
				break;
			case "-pl" :
				graph.plotLineChart();
				break;
			case "-pb" :
				graph.plotBarChart();
				break;
		}
	} else {
		graph.plotBarChart();
	}
	graph.display();
	//Output the total energy:
	console.log("Total: "+jsonData.sum+" "+jsonData.unit);
}

//HTTP request to get the data for the given space id
function getSpaceIdData () {
	//Data HTTP request Setup:
	var options = {
		host: 'api.pulseenergy.com',
		path: '/pulse/1/spaces/'+spaceId+'/data.json?resource=Total&interval=Week&quantity=Energy&key='+apiKey
	};
	var callback = function(response) {
		var data = '';
		response.on('error', function(e) {
			console.log("HTTP Error: " + e.message);
		});
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			var jsonData;
			// console.log('END!');
			// console.log(data);
			//Some quick error checking:
			try {
				jsonData = JSON.parse(data);
				drawGraph(jsonData);	
			} catch (e) {
				console.error("Error: "+e);
			}
		});
	};
	http.get(options, callback);
}

//HTTP request to get the valid space ids
function getValidSpaceIds () {
	//Data HTTP request Setup:
	var options = {
		host: 'api.pulseenergy.com',
		path: '/pulse/1/spaces.json?key='+apiKey
	};
	var callback = function(response) {
		var data = '';
		response.on('error', function(e) {
			console.log("HTTP Error: " + e.message);
		});
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			var jsonData;
			// console.log('END!');
			// console.log(data);
			jsonData = JSON.parse(data);
			for (var ii in jsonData){
				// console.log("Space:"+jsonData[ii]);
				if ( jsonData[ii].id == spaceId ) {
					// console.log("Valid spaceID");
					return getSpaceIdData();
				}
			}
			console.error("Error: Space ID not found for this key.");
		});
	};
	http.get(options, callback);
}
getValidSpaceIds();





/*
//Sample data
//Read in some data, convert to JSON, print it out
function readSampleData(error, data) {
	if ( error ) {
		console.log("Error:",error);
		return;
	}
	var jsonData = JSON.parse(data);
	// console.log("JSON Data:",jsonData);
	//Now we need to plot it:
	drawGraph(jsonData);
	//Output the total energy:
	console.log("Total: "+jsonData.sum+" "+jsonData.unit);
}
fs.readFile("sampleData.txt", readSampleData);
*/