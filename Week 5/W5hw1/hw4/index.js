'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const {response} = require("express");
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const NodeCache = require('node-cache')
const myCache = new NodeCache()

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/style', express.static(path.resolve(__dirname, 'public/style')));
app.use('/icon', express.static(path.resolve(__dirname, 'public/icon')));
app.use( express.static( "uploads" ) )
app.listen(3070, function () {
    console.log('Listening port 3000. http://localhost:3000');
});

function heavyComputation(){
    let temp = 0;
    for(let i=0; i<100000; i++)
        temp = (Math.random()*5342)%i;
    return 123;
}

app.get('/api', (req, res)=>{

    // If cache has key, retrieve value
    // from cache itself
    if(myCache.has('uniqueKey')){
        console.log('Retrieved value from cache !!')

        // Serve response from cache using
        // myCache.get(key)
        res.send("Result: " + myCache.get('uniqueKey'))
    }else{

        // Perform operation, since cache
        // doesn't have key
        let result =  heavyComputation()

        // Set value for same key, in order to
        // serve future requests efficiently
        myCache.set('uniqueKey', result)

        console.log('Value not present in cache,'
            + ' performing computation')
        res.send("Result: " + result)
    }
})



const multer = require('multer');

// let setCache = function (req, res, next) {
//     // here you can define period in second, this one is 5 minutes
//     const period = 60 * 5
//
//     res.set('Cache-control', `public, max-age=${period}`)
//
//
//     // remember to call next() to pass on the request
//     next()
// }
// app.use(setCache)

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, 'uploads/');

    },

    filename: function(req, file, cb) {
        let length = 0;
        fs.readdir("uploads", (err, files) => {
            length = files.length;
            cb(null, length + path.extname(file.originalname));
            console.log(length);
        });
    }


});


app.get('/', (req, res) => {

    res.render('index');
})

app.get('/images',  (req, res) => {


        fs.readdir(path.resolve(__dirname, './uploads'), (err, files) => {
            if (err) {
                throw err
            }
        let photo = []
            // files object contains all files names
            // log them on console
            for(let i= 0; i< files.length;i++){
                    let image = {};
                    image.name = files[i];
                    image.id = files[i].replace('.png','');
                    photo.push(image);
                }
            console.log(photo)
            res.json(photo)
        })

        // const files = await fs.promises.readdir(path.resolve(__dirname, './uploads'));
        // console.log(files);
        //  const photo = [];
        // console.log("length:"+files.length)
        // for(let i= 0; i< files.length;i++){
        //     let image = {};
        //     image.name = files[i];
        //     image.id = files[i].replace('.png','');
        //     console.log("image:"+image)
        //     photo.push(image);
        // }
        // console.log(photo)




});
const upload = multer({ storage: storage })
app.post('/:id', async (req, res) =>{
    let id  = req.params.id.replace('.png','');
    console.log(id);
    // You aren't doing anything with data so no need for the return value
    let path = "./uploads/" + id + ".png";
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }

        //file removed
    });
})


// now call the new middleware function in your app


app.post('/', upload.array('multi-files'),(req, res) => {
    // res.set({
    //     "Cache-Control": "public, max-age=86400",
    //     "Expires": new Date(Date.now() + 86400000).toUTCString()
    // })
    // console.log(req.headers);


    res.redirect('/');

});