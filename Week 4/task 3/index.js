
'use strict';

const path = require('path');
const express = require('express');
const serialport = require('serialport');
const ejs = require('ejs');
const util = require('util');
const {ReadlineParser} = require('@serialport/parser-readline');
const createInterface = require('readline').createInterface;

const SerialPort = serialport.SerialPort;

const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.set('view engine', 'ejs');

const com = new SerialPort({path: '/dev/tty.usbmodem2203', baudRate: 115200});

const parser = com.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let temp_late = 0;
let client;
mongo.connect('mongodb://localhost:27017/', function (error,db) {
    if(error) throw error;
    client = db.db('temperature')
    console.log('Db is up');
});

com.on('readable', () => {
    com.read();
});

app.listen(3002, function () {
    console.log('Listening port 3002. http://localhost:3002');
});

parser.on('data', data => {
    temp_late = JSON.parse(data);
    let msr = JSON.parse(data);
    client.collection('temp_mes').insertOne(msr, function (error, res) {
        if (error) throw error;
        console.log('Inserted mesurement: ' + msr);
    });
});


app.get('/', (req,res) => {
    try {
        client.collection('temp_mes').find({}).toArray(function (error,result) {
            if(error) throw error;
            let measurements = JSON.parse(JSON.stringify(result));
            let ave_temp = 0;
            let i = 0;
            let max = -500;
            let min = 500;
            for (let msr of measurements) {
                ave_temp += msr.temperature;
                i++;
                if (min > msr.temperature) min = msr.temperature;
                if (max < msr.temperature) max = msr.temperature;
            }
            ave_temp /= i;
            res.render('index', {temp: temp_late.temperature, max_temp: max, min_temp: min, ave_temp: ave_temp});
        });
    } catch (error) {
        res.status(500).send('Unable to get measurements.');
    }
});