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

// const viewDir = path.resolve(__dirname, 'views');

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/style', express.static(path.resolve(__dirname, 'public/style')));
app.use('/icon', express.static(path.resolve(__dirname, 'public/icon')));
app.use( express.static( "uploads" ) )
app.listen(3000, function () {
    console.log('Listening port 3000. http://localhost:3000');
});




const multer = require('multer');




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

    res.render('home');


});
app.get('/image', async (req, res) => {
    console.log("hi");
    const files = await fs.promises.readdir(path.resolve(__dirname,'./uploads'));
    console.log(files);
    let photo = [];
    console.log("length:"+files.length)
        for(let i= 0; i< files.length;i++){
            let image = {};
            image.name = files[i-1];
            image.id = files[i-1].replace('.png','');
            console.log("image:"+image)
            photo.push(image);
        }
    console.log(photo)
    res.json(photo);



});
const upload = multer({ storage: storage, cacheControl: 'max-age=604800' })
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
app.post('/', upload.array('multi-files'),(req, res) => {
    // res.set({
    //     "Cache-Control": "public, max-age=86400",
    //     "Expires": new Date(Date.now() + 86400000).toUTCString()
    // })
    // console.log(req.headers);


    res.redirect('/');

});