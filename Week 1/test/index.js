'use strict';

// const path = require('path');
const express = require('express');
// var jsdom = require("jsdom");
// var JSDOM = jsdom.JSDOM;

const app = express();


// Express setup

// global.document = new JSDOM(__dirname +'/views/home.html').window.document;
//

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    // res.sendFile(__dirname +'/views/home.html');
    res.render('home');
});
app.get('/:a',(req,res)=>{
    console.log(req.params.a);
    // if (req.params.a == 'check'){
    //     var randomNumber = Math.floor(Math.random() * 6) + 1;
    //     res.redirect('/'+randomNumber);
    // }
    // if (req.params.a == '1'){
    //     res.render("die");
    //     // res.send("hello1");
    // }
    // else if (req.params.a == '2'){
    //     document.getElementById('photo').src = "/views/2.png";
    //     res.render("die");
    //     // res.send("hello2");
    // }
    // else if (req.params.a == '3'){
    //     document.getElementById('photo').src = "/views/3.png";
    //     res.render("die");
    //     // res.send("hello3");
    // }
    // else if (req.params.a == '4'){
    //     document.getElementById('photo').src = "/views/4.png";
    //     res.render("die");
    //     // res.send("hello4");
    // }
    // else if (req.params.a == '5'){
    //     document.getElementById('photo').src = "/views/5.png";
    //     res.render("die");
    //     // res.send("hello5");
    // }
    // else if (req.params.a == '6'){
    //     document.getElementById('photo').src = "/views/6.png";
    //     res.render("die");
    //     // res.send("hello6");
    // }else {
    //     res.send("Error. The number is not in the range of 1-6.");
    // }
})
// function select(number) {
//     var randomNumber = Math.floor(Math.random() * 6) + 1;
//     return randomNumber;
// }



// var btn = document.getElementById("click");//


app.get('/image', (req, res) => {
	// Return a die template
});


app.listen(3000);
