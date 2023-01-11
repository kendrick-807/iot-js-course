'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
var mongo = require('mongodb');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cars";




app.get('/', async (req, res) => {
    try {

        // MongoClient.connect(url, function(err, db) {
        //     if (err) throw err;
        //     var dbo = db.db("cars");
        //     dbo.collection("cars").deleteMany({}, function(err, obj) {
        //         if (err) throw err;
        //         console.log("1 document deleted");
        //     });
        //
        // });
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cars");
            dbo.collection("cars").find().toArray((err, car_arr) => {
            if(err) throw err;
            res.json(car_arr);
            console.log(car_arr);
            })
        });


        // const cars = await read();

    } catch (e) {
        res.status(404).send(e);
    }
});




app.post('/', async (req, res) => {
    const car = req.body;  // Probably unsafe to treat the entire body as a car object, but will do for the task
    car.id = Math.floor(Math.random() * 1000 + 1).toString();

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cars");
        dbo.collection("cars").insertOne(car, function(err, res) {
            if (err) throw err;
            console.log("1 car inserted!");
            db.close();
        });

    });
    res.redirect('/')

});
app.get('/makes/:make', async (req, res) => {
    try {
        var carMake = req.params.make;
        let findCar = {make: carMake};
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cars");
            dbo.collection("cars").find(findCar).toArray((err, car_arr) => {
                if(err) throw err;
                res.json(car_arr);
            })
        });
    } catch (e) {
        res.status(404).send(e);
    }
});
app.get('/:id', async (req, res) => {
    try {

        var carId = req.params.id;
        console.log(carId);
        let carFind = { id: carId };
        console.log(carFind);
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cars");
            dbo.collection("cars").find(carFind).toArray((err, car_arr) => {
                if(err) throw err;
                console.log(car_arr);
                res.json(car_arr);
            })
        });
    } catch (e) {
        res.status(404).send(e);
    }
})
//
app.delete('/:id', async (req, res) => {
    try {

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cars");
            dbo.collection("cars").deleteOne({id: req.params.id}, function(err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
            });

        });


        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(200);
    }
});


app.listen(3000);