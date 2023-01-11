'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
const sqlite3 = require('sqlite3').verbose();
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));




let db = new sqlite3.Database('./cars.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cars database.');
});

db.run(`create table if not exists cars (
    make TEXT NOT NULL,
    id TEXT NOT NULL,
    unique(make,id)
);`
);


app.get('/', async (req, res) => {
    try {

        db.all(`select * from cars`,[],(err, rows)=>{
           console.log(rows);
           res.json(rows);
        });



    } catch (e) {
        res.status(404).send(e);
    }
});




app.post('/', async (req, res) => {
    const car = req.body;  // Probably unsafe to treat the entire body as a car object, but will do for the task
    car.id = Math.floor(Math.random() * 1000 + 1).toString();

    const insert = `INSERT INTO cars (make,id) values(?,?)`;
    db.run(insert,[car.make,car.id],(err) =>{
        if(err) return;
        console.log("One car added.");
    })
    res.redirect('/')

});
app.get('/makes/:make', async (req, res) => {
    try {
        var carMake = req.params.make;
        db.all(`select * from cars where make = '${carMake}'`,[],(err,rows) =>{
          if(err) console.log(err);
          res.json(rows);
          console.log(rows);
        })

    } catch (e) {
        res.status(404).send(e);
    }
});
app.get('/:id', async (req, res) => {
    try {

        var carId = req.params.id;

        db.all(`select * from cars where id = '${carId}'`,[],(err, rows)=>{
          if(err) console.error(err);
          console.log("Car found.")
            res.json(rows);
          console.log(rows)

        })

    } catch (e) {
        res.status(404).send(e);
    }
});

app.delete('/:id', async (req, res) => {
    try {
        let idDelete = req.params.id;

        db.run(`delete from cars where id = '${idDelete}' `,[],(err)=>{
            if(err) console.error(err);
            console.log("car id" +idDelete + "deleted.");

        })

       res.sendStatus(200);
    } catch (e) {
        res.sendStatus(200);
    }
});


app.listen(3000);