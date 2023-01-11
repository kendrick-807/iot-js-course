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
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs');
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/style', express.static(path.resolve(__dirname, 'public/style')));
app.use('/icon', express.static(path.resolve(__dirname, 'public/icon')));
// app.use( express.static( "uploads" ) )
app.listen(3000, function () {
	console.log('Listening port 3000. http://localhost:3000');
});


let list = [];
let list2 = [];


app.get('/',async (req, res) =>{
	// list = JSON.parse((await readFile('./message.json')).toString());
	res.render('home');
})

// app.get('/messages',async (req,res)=>{
// 	list2 = JSON.parse((await readFile('./message.json')).toString());
// 	console.log(list2)
// 	res.json(list2);
//
// })
// app.post('/message', async (req, res) => {
// 	let newList = [];
// 	try{
// 		newList = JSON.parse((await readFile("./message.json")).toString());
// 		let userMessage = req.body.name;
// 		console.log(userMessage);
// 		newList.push({userMessage});
// 		console.log(newList);
// 		await writeFile("./message.json", JSON.stringify(newList, null, 2));
// 	}catch(e){
// 		console.error(e.message);
// 	}
// 	res.redirect('/');
// });
//
// app.get('/logout', (req, res,next) => {
// 	var err = new Error('You have logged out !');
// 	err.status = 401;
// 	res.setHeader('WWW-Authenticate', 'Basic').send("asdfghjsdfgh");
// 	return next(err)
//
//
// });


app.listen(3015);
// app.get('/',  (req, res) =>{
// 	res.sendFile(__dirname + '/views/home.html');
// })
