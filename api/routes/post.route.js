var express = require('express');
var postController = require('../controller/post.controller');

var route = express.Router();

route.get('/', postController.getPosts);
route.get('/createnewpost', postController.getCreateNewPost);
route.post('/createnewpost', postController.postCreateNewPost);
route.get('/delete', postController.removePost);
route.get('/find_by_id', postController.getPostsById);
route.get('/find_with_criteria', postController.findPostsWithCriteria);
route.get('/update', postController.updatePost);
module.exports = route;