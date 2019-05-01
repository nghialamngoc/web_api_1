const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// import Route
const postRoute = require('./api/routes/post.route');
const userRoute = require('./api/routes/user.route');

//mogodb connection string
let mongodbConnectionString = 
    'mongodb+srv://nghialamngoc:'
    + process.env.MONGO_ATLAS_PW 
    +'@webapi-for-learningwebsite-lmoy2.mongodb.net/api_learningWebsite?retryWrites=true';

mongoose.Promise = global.Promise;

mongoose.connect(mongodbConnectionString, {useNewUrlParser: true})
    .then(
    () => {
        console.log('Connect Db successfully');
    },
    err => {
        console.log('Connection falied. Error: ' + err);
    }
);

var app = express();


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
            'GET, PUT, POST, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next();
})

app.use('/post', postRoute);
app.use('/user', userRoute);

//Handler for 404 - resource not found
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
})

module.exports = app;