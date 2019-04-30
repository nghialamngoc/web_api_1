var express = require('express');
var postController = require('../controller/post.controller');

var route = express.Router();

route.get('/', postController.getPosts);
route.get('/:postId', postController.getPostsById);
route.get('/find_with_criteria', postController.findPostsWithCriteria);
route.get('/find_one_with_criteria', postController.findOnePostsWithCriteria);
route.get('/error', (req, res, next) => {
	throw new Error('This is a forced Error');
})

route.post('/createnewpost', postController.postCreateNewPost);
route.patch('/update', postController.updatePostWithPath);

route.delete('/delete', postController.deletePost);

module.exports = route;