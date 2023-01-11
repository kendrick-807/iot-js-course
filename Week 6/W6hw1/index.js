// Use this function to interpolate between two colors
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const {response} = require("express");
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

// const viewDir = path.resolve(__dirname, 'views');

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/style', express.static(path.resolve(__dirname, 'public/style')));
app.use('/icon', express.static(path.resolve(__dirname, 'public/icon')));
app.use( express.static( "uploads" ) )
app.listen(3000, function () {
	console.log('Listening port 3000. http://localhost:3000');
});

const object1 = {};

Object.defineProperties(object1, {
	load: {

		  function(){

			 fs.readFile('Demo.txt', 'utf8', function(err, data){

				 // Display the file conten
				 return data;
			 });
		},
		writable: true,

	},
	save: {}
});

console.log(object1.property2);

app.get('/',  (req, res) =>{
	res.sendFile(__dirname + '/views/home.html');
})
