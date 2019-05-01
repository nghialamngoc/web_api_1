var express = require('express');
const multer = require('multer');
var postController = require('../controller/post.controller');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, Date.now() + file.originalname);
	}
})

const fileFitter = (req, file, cb) => {
	if(
			file.mimetype === 'image/jpeg' || 
			file.mimetype === 'image/png'
		)
		cb(null, true);
	else
		cb(new Error('Your image should be have extention are png or jpeg'), false);
}

const upload = multer({
	storage: storage,
	limits: {
		fieldSize: 1024 * 1024 * 5
	},
	fileFilter: fileFitter	
});

var route = express.Router();

route.get('/', postController.getPosts);
route.get('/:postId', postController.getPostsById);
route.get('/find_with_criteria', postController.findPostsWithCriteria);
route.get('/find_one_with_criteria', postController.findOnePostsWithCriteria);
route.get('/error', (req, res, next) => {
	throw new Error('This is a forced Error');
})

route.post('/create', upload.single('postImage') , postController.postCreateNewPost);
route.patch('/update', postController.updatePostWithPath);

route.delete('/delete', postController.deletePost);

module.exports = route;