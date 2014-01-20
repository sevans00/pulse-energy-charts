//Strict mode (for now)
"use strict";

//Imports:
var colors = require('./node_modules/colors');
var fs = require('fs');




var apiKey = "9C3B13239D75E73FDE883C934FF647A1";
var spaceId = process.argv[2];

console.log("Space ID:",spaceId);



//Read in some data, convert to JSON, print it out, for great justice
function readSampleData(error, data) {
	console.log("Error:",error);
	console.log("Contents of sample:",data);
	var jsonData = JSON.parse(data);
	console.log("JSON Data:",jsonData);
	//Now we need to plot it:
	
	//Colors!  Yay!
	console.log("asdf".green,"fdsa".red);
}



fs.readFile("sampleData.txt", readSampleData);

