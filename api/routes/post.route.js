var express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
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
route.get('/:searchParam', postController.searchParam);

route.post('/create', checkAuth, upload.single('postImage'), postController.postCreateNewPost);

route.patch('/update', checkAuth, postController.updatePostWithPath);

route.delete('/delete/:postId', checkAuth, postController.deletePost);

module.exports = route;