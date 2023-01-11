'use strict';

const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs')
app.use( express.static( "public" ) );

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/views/home.html');

});

app.get('/:checks', (req, res) => {
    let randomNumber = getRan();
        if(req.params.checks === "check") {
            res.redirect('/' + randomNumber);
        }
        else if (req.params.checks > 0 && req.params.checks < 7) {
            res.render("die", {ran: req.params.checks});
        } else {
            res.render("error");
            res.status(404);
        }

});


app.get('/:a/*', (req, res) => {
    res.send("error");
});

function getRan(){
    return (Math.floor(Math.random() * 6) + 1);
}









app.listen(3000);
