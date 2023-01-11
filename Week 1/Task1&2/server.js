
'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.get('/', (req, res,next) => {
    res.render('index');
    next();
}),function(req, res){
    res.redirect('/:name');
}


// app.get('/', (req, res) => {
//
//     res.redirect('/:name');
//
// })
app.get('/:name' , (req, res) => {
    let name = req.params.name;
    let age = req.query.age;
    if (req.query.age == undefined){
        res.render('age');
    }else {
        if(req.query.age >=18)
            res.send("Hello "+name+" ,your age is "+age+".");
        else if(req.query.age < 18)
            res.send("Sorry, you are too young to access.");
    }


});

app.get('/:name/*' , (req, res) => {
    let name = req.params.name;
    let age = req.query.age;
    res.redirect('/' + name + '?' + 'age=' + age);
});


app.listen(3000);
