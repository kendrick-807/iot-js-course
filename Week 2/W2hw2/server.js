const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const os = require('os');


app.get('/ram', async (req, res) => {
    const json_res = {free_mem: os.freemem(), total_mem: os.totalmem()};
    res.json(json_res);
});

app.get('/',async (req, res) => {
    res.render("home");
})




app.listen(3000);