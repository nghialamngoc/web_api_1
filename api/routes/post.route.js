var express = require('express');
var postController = require('../controller/post.controller');

var route = express.Router();

route.get('/', postController.getPosts);
route.get('/createnewpost', postController.getCreateNewPost);
route.post('/createnewpost', postController.postCreateNewPost);
route.get('/delete', postController.removePost);
route.get('/find', postController.findPosts);
route.get('/update', postController.updatePost);
module.exports = route;