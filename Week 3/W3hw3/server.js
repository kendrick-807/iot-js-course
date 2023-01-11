
'use strict';

const path = require('path');

const express = require('express');
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join('lab3', 'views'));
app.use(express.static('./lab3/images'));

const signal_capture_port = new SerialPort({
    path: "COM22",
    baudRate: 115200
});

app.get('/', (req, res) => {
    res.render('die_home');
});


app.get('/image', (req, res) => {

    signal_capture_port.on('open' , (err) => {
        if (err) console.error(err);
        console.log("OPENED");
    });


    signal_capture_port.write('a', 'ascii', (err) => {
        if (err) console.error(err);
        console.log("Wrote a");
    });

    signal_capture_port.write('q', 'ascii', (err) => {
        if (err) console.error(err);
        console.log("Wrote q");
    });

    const chunks = [];

    setTimeout(() => {
        signal_capture_port.on('readable', () => {
            let chunk;
            while (null !== (chunk = signal_capture_port.read(22))) {
                chunks.push(chunk);
                console.log("CHUNK: ", chunk.toString());
                console.log("CHUNKS INSIDE: ", chunks.toString()[11]); //11th character is the result
                res.json(Number(chunks.toString()[11]));
                signal_capture_port.close();
            }
        });

    }, 100);
});

app.get('/:result', (req, res) => {
    res.render('die_res');
});


app.listen(3000);