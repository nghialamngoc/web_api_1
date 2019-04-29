const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// import Route
const postRoute = require('./api/routes/post.route')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/express-demo', { useNewUrlParser: true}).then(
    () => {
        console.log('Connect Db successfully');
    },
    err => {
        console.log('Connection falied. Error: ' + err);
    }
);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/post', postRoute);

//Handler for 404 - resource not found
app.use((req, res, next) => {
    res.status(404).send("I think you lost!")
})

//Handle for Error 500
app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.sendFile(path.join(__dirname, '/views/500.html'))
})

module.exports = app;