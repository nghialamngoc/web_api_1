const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/post', postRoute);


app.listen(port, function(){
    console.log(`Server listening on port ${port}`)
})