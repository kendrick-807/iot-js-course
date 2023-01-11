
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const {hashPassword, verifyPassword} = require("./pbkdf2");

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set("views", (path.join(__dirname, "views")));

const port = process.env.PORT || 3000;

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    hashPassword(password).then(hashedPassword => {
        const newUser = {username, hashedPassword, logins: [], logouts: []};
        addUser(newUser).then(msg => res.redirect('/')).catch(err_msg => res.send(err_msg));
    }).catch(err => res.send(err));
});

//app.use(auth);

app.get('/', async (req, res) => {
    //default view
    res.render("login");
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let query_obj = { username: username };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("users");
        dbo.collection("users").find(query_obj).toArray((err, user_arr) => {
            const user = user_arr[0];
            if(user !== undefined) {
                verifyPassword(password, user.hashedPassword)
                    .then((equal) => {

                        if(equal) {
                            res.status = 200;
                            if(req.cookies.curr_user !== user.username) {
                                res.cookie("curr_user", user.username);
                                res.cookie("loggedIn", true);
                                const update_obj = {$set: {logins: [...user.logins, Date.now()]}};
                                console.log(`User ${user.username} logged in at ${Date.now().toString()}`);
                                dbo.collection("users").updateOne({username: user.username}, update_obj,
                                    (err, res) =>{
                                        if(err) throw err;
                                        console.log(res);
                                    });
                            }
                            res.cookie("login_err", 200);
                            return res.redirect('/auto');
                        } else {
                            res.cookie("login_err", 401);
                            return res.redirect('/');
                        }
                    })
                    .catch((err_msg) => {
                        res.cookie("login_err", 401);
                        return res.redirect('/');
                    });
            } else {
                console.log("USERNAME NOT FOUND");
                res.cookie("login_err", 401);
                return res.redirect('/');
            }
        });
    });
});


app.get('/statistics/temperature', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    res.render('temp_stats');
});

app.get('/statistics/user', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    res.render('user_stats');
})

app.get('/temp_data', async (req, res) => {
    //random data for testing purposes
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    const data = {x: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        y: [7, 10, 15, 4, -10, -35, -36, -20, -10, -5, -4]};
    res.json(data);
});


app.get('/user_data', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    const username = req.cookies.curr_user;
    MongoClient.connect(url, function (err, db) {
        if (err) console.error("FAILED TO CONNECT TO DATABASE");
        const dbo = db.db("users");
        dbo.collection("users").find({username: username}).project({_id: 0, logins: 1, logouts: 1}).toArray((err, arr) => {
            if (err) throw err;
            if (arr[0] !== undefined) {
                const user = arr[0];
                const size = user.logins.length;
                const loginTime = [];
                const loggedInTime = [];
                let averageTime = 0;
                let totalTime = 0;
                console.log(size);
                for(let i=0;i<size-1;i++){
                    loginTime[i] = user.logins[i];
                    loggedInTime[i] = (user.logouts[i] - loginTime[i])/(1000*60);
                    totalTime += (user.logouts[i] - user.logins[i]);
                    averageTime = totalTime/(size-1);
                }
                const testData = [10,20,25]

                const data = {x: loginTime, y:loggedInTime ,z:username,t:testData,a:averageTime };

                console.log(data);
                res.json(data);
            }
        });
        // dbo.collection("users").find().forEach(e=>{
        //         let test = 0;
        //         for(let i =0; i < e.logins.length;i++){
        //             test += e.logins[i]
        //         }
        //         console.log(test);  // Printing the keys
        //
        //
        // })

    })
});
app.get('/logout', (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    const username = req.cookies.curr_user;
    MongoClient.connect(url, function (err, db) {
        if (err) console.error("FAILED TO CONNECT TO DATABASE");
        const dbo = db.db("users");
        dbo.collection("users").find({username: username}).toArray((err, arr) => {
            if (err) throw err;
            if(arr[0] !== undefined) {
                const user = arr[0];
                const update_obj = {$set: {logouts: [...user.logouts, Date.now()]}};
                console.log(`User ${user.username} logged out at ${Date.now().toString()}`);
                dbo.collection("users").updateOne({username: user.username}, update_obj,
                    (err, res) =>{
                        if(err) throw err;
                        console.log(res);
                    });
            }
        });

    });
    res.cookie("curr_user", "");
    res.cookie("loggedIn", false);
    res.redirect('/');
});

app.get('/auto', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    res.render('auto', {pressure: 0});
});

app.get('/manual', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    res.render('manual');
});



app.post('/pressure', async (req, res) => {
    if(req.cookies.loggedIn === "false") return res.redirect('/');
    const pressure = req.body.pressure || 0;
    console.log(`PRESSURE LEVEL: ${pressure} Pa`);
    res.render('auto', {pressure: pressure});
});


app.listen(port, () => {
    console.log(`SERVER UP ON PORT ${port}`);
});


const addUser = (newUser) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) reject("FAILED TO CONNECT TO DATABASE");
            const dbo = db.db("users");

            dbo.collection("users").find({username: newUser.username}).toArray( (err, res) => {
                if(res[0] !== undefined) reject("USERNAME ALREADY TAKEN");
                else {
                    dbo.collection("users").insertOne(newUser, function (err) {
                        if (err) reject("FAILED TO ADD NEW USER TO DATABASE. PLEASE TRY AGAIN.");
                        resolve("SIGNED UP SUCCESSFULLY");
                        db.close().then(r => console.log(r));
                    });
                }
            });
        });
    });
}