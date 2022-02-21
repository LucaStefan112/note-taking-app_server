const fs = require('fs')
const express = require('express')
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/files', (req, res) => {
    fs.readFile('data.json', 'utf8' , (err, content) => {
        if(err){
            res.send("Internal error").status(500);
            console.log("Error: ", err);
        }

        res.send(JSON.parse(content))
    })
})

app.post('/new-file', (req, res) => {

})

app.listen(4123)