const express = require('express');
const userController = require('../controller/user.controller');

var route = express.Router();

route.post('/signup', userController.signUp);
route.post('/login', userController.login);
route.delete('/:userId', userController.delete);

module.exports = route;