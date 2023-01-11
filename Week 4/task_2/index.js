'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const viewDir = path.resolve(__dirname, 'views');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');




function write(data, filePath = 'cars.json') {
    return writeFile(path.resolve(__dirname, filePath), JSON.stringify(data))
        .catch(err => console.error('Failed to write file:', err));
}


function read(filePath = 'cars.json') {
    return readFile(path.resolve(__dirname, filePath)).then(data => JSON.parse(data));
}

app.get('/',async (req, res) => {

    res.sendFile('index.html', {root: viewDir});
});
app.get('/add', (req, res) => {
    res.sendFile('add.html', {root: viewDir});
});
app.get('/cars', async (req, res) => {
    try {
        const cars = await read();
        console.log(cars)
        res.json(cars);



    } catch (e) {
        res.status(404).send(e);
    }
});


app.post('/add', async(req, res) => {
    let make = req.body.make;
    let model = req.body.model;
    let mileage = req.body.mileage;
    let year = req.body.year;
    let plate = req.body.plate;
    const car = {make,model,mileage,year,plate};
    car.id = crypto.randomUUID();
    let cars = [];
    try{
        cars = await read();
    }catch (e) {

    }

    cars.push(car);
    console.log(car);
    write(cars);
    res.redirect('/')
});
app.delete('/:id', async (req, res) => {
    try {
        const cars = await read();
        write(cars.filter(c => c.id !== req.params.id));
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(200);
    }
});
app.listen('3000');