'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const pbkdf2 = util.promisify(crypto.pbkdf2);

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

function write(data, filePath = './data.json') {
    return writeFile(path.resolve(__dirname, filePath), JSON.stringify(data));

}


function read(filePath = './data.json') {
    return readFile(path.resolve(__dirname, filePath)).then(data => JSON.parse(data));
}
function readMessages(filePath = './message.json') {
    return readFile(path.resolve(__dirname, filePath)).then(data => JSON.parse(data));
}

let savedPassword;

var loginUser;
pbkdf2('kendrick', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
    savedPassword = derivedKey.toString('hex');
});


//  async function authentication(req, res, next) {
//
//
//      const pplData = await read();
//
//
//          const authheader = req.headers.authorization;
//
//
//          if (!authheader) {
//              const err = new Error('You are not authenticated!');
//              res.setHeader('WWW-Authenticate', 'Basic');
//              err.status = 401;
//              return next(err)
//          }
//
//          var auth = new Buffer.from(authheader.split(' ')[1],
//              'base64').toString().split(':');
//          var user = auth[0];
//          loginUser = user;
//          var pass = auth[1];
//         pbkdf2(pass, 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
//              if (err) throw err;
//
//             if (pplData.find(p => p.password == derivedKey.toString('hex')) )&& pplData.find(p => p.username == user) {
//                 for(let i = 0;i < pplData.length;i++) {
//                     console.log(pplData[i]);
//                     if (pplData.find(p => p.password == derivedKey.toString('hex')) && pplData.find(p => p.username == user) && pplData.find(p => p.id == i)) {
//                         next();
//                     }
//                 }
//             } else {
//                 var err = new Error('You are not authenticated!');
//                 res.setHeader('WWW-Authenticate', 'Basic');
//                 err.status = 401;
//                 return next(err);
//
//             }
//
//
//         });
//
//
//
// };
//
//
// app.use(authentication);
let list = [];
app.get('/',async (req, res) =>{
    list = JSON.parse((await readFile('./task_1/message.json')).toString());

    console.log("hello"+list);
    res.render(path.resolve(__dirname, "./views/index"),{list:list});
})
// app.get('/',async (req, res) => {
//
//      list = JSON.parse((await readFile("./message.json")).toString());
//      console.log(list);
//     res.render(path.resolve(__dirname, "./views/index"),{list:list});
//
// });

app.post('/message', async (req, res) => {
    let newList = [];
    const parsedTime = Date().toString();
    try{
        newList = JSON.parse((await readFile("./message.json")).toString());
        let userMessage = req.body.message;
        newList.push({loginUser, userMessage,parsedTime})
        console.log(newList);
        await writeFile(path.resolve(__dirname, "./message.json"), JSON.stringify(newList, null, 2));
    }catch(e){
        console.error(e.message);
    }
    res.redirect('/');
});

app.get('/logout', (req, res,next) => {
    var err = new Error('You have logged out !');
    err.status = 401;
    res.setHeader('WWW-Authenticate', 'Basic');
    return next(err)


});




// Server setup

// Middleware: request authentication if not already authenticated
app.listen((4000), () => {
    console.log("Server is Running ");
})
// The rest of the routes
