'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

let events_list = [];

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    events_list = req.cookies.events ?? [];
    console.log(events_list);
    res.render("home",{events_list:events_list});

});


app.post('/events', (req, res) => {
    events_list = req.cookies.events ?? [];
    let name = req.body.name;
    let date = req.body.date;
    events_list.push({name, date});
    console.log(name,date);
    res.cookie('events',events_list,{maxAge : 86400000,httpOnly : true});
    res.redirect('/');
});


app.get('/reset', (req, res) => {
    res.clearCookie("events");
    res.cookie('events', []);
    res.redirect('/');
});
app.listen(3000);