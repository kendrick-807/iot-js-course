const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');



let stock = [];
app.get('/',  async (req, res,next) => {
    await fs.readFile('test.json', (err, data) => {
        if (data != '') {
            var myObject = JSON.parse(data);
        }
        stock.push(myObject);
        var ids = Object.values(myObject);
        res.send(stock);
        console.log(stock);
    });

})

app.post('/', async(req, res,next) => {

    let list = [];
    try{
        const data = await readFile('test.json');
        if(data.length !== 0 ) {
            list = JSON.parse(data);
            console.log("not empty json");
        }
        const cars = req.body ; //store required data from input into body as "JSON"
        console.log(cars);
        cars.id = Math.floor(Math.random() * 1000 + 1);
        list.push(cars);
        await writeFile('test.json',JSON.stringify(list, null, 2));
    }catch(e){
        console.error(e.message);
    }
    res.redirect('/');
})

app.get('/:id' , async  (req, res) => {
    let idNum = req.params.id;
    fs.readFile('test.json', (err, data) => {
        if (data != '') {
            var myObject = JSON.parse(data);
        }
        stock.push(myObject);
        var ids = Object.values(myObject);
        for(var i=0;i <= stock.length;i++){
            if(idNum == ids[i].id){
                console.log("car with id " + ids[i].id +" found.");
                res.send(ids[i]);
                // found = true;
                break;
            }

        }

    })
})


app.delete('/:id', async (req, res) => {
    let idDelete = req.params.id;
    console.log(idDelete);
    let newCar = []
    let car = [];
    try{
        const data = await readFile('test.json');
        if(data.length !== 0 ) {
            list = JSON.parse(data);
        }
        newCar.push(list);
        var ids = Object.values(list);
        console.log(ids[0].id);

        for (var i = 0; i <= stock.length; i++) {
            if (idDelete == ids[i].id) {
                console.log("car with id " + ids[i].id +" deleted.");
            } else {
                car.push(ids[i]);
            }
        }
        await writeFile('test.json',JSON.stringify(car, null, 2));
    }catch(e){
            console.error(e.message);
        }
        res.redirect('/');
})



    app.listen(3000);
