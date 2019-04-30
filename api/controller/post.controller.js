const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports = {

	getPosts: function (req, res, next) {
		Post.find().select({ __v: 0 })
			.then(data => {
				const respone = {
					count: data.length,
					data: data.map(data => {
						return {
							title: data.title,
							content: data.content,
							subject: data.subject,
							createDate: data.createDate,
							request:{
								type: 'GET',
								url: 'http://localhost:8000/post/' + data._id
							}
						}
					})
				}		
				res.status(200).json(respone);						
			})
			.catch(err => {
				 res.status(500).json({
						message: `Error is ${err}`
					})				
			});
	},

	findOnePostsWithCriteria: function(req, res){

		if(!req.query.title)
			return res.status(400).send('Missing URL parameter Title');

		findCriteria = {
			title: new RegExp( req.query.title ,'i')
		} 
		Post.findOne(findCriteria)
			.then( data => {
				if(data)
					return res.json(data);
				res.json({
					message: 'Not found'
				})
			})
			.catch(err => {
				res.json(err)
			})
	},

	getPostsById: function (req, res) {
		let postId = req.params.postId;
		if(!mongoose.Types.ObjectId.isValid(postId))
			return res.status(500).json({
				message: 'Something not correct'
			})
		Post.findById({ _id: mongoose.Types.ObjectId(postId)})		
			.then(data => {				
				const result = {
					title: data.title,
					content: data.content,
					subject: data.subject,
					createDate: data.createDate,
					request: {
						type: 'GET',
						url: 'http://localhost:8000/post/' + data._id
					}
				}				
				res.status(200).json(result)
			})
			.catch(err => {
				res.status(500).json(err)
			});		
	},

	findPostsWithCriteria: function (req, res) {
		var findCriteria = {
			title: new RegExp(req.query.title, 'i')
		};

		Post.find(findCriteria).exec((err, data) => {
			if (err) {
				return res.json({
					result: 'failed',
					data: {},
					message: `Error is ${err}`
				})
			}
			return res.json({
				result: 'success',
				data,
				message: `success`
			})
		});
	},

	postCreateNewPost: function (req, res) {
	
		let newPost = new Post({
			_id: mongoose.Types.ObjectId(),
			title: req.body.title,
			subject: req.body.subject,
			createDate: req.body.createDate,
			content: req.body.content
		})

		newPost.save()
			.then(() => {
				res.status(201).json({
					message: 'Create new post successfully',
					newPost: {
						title: newPost.title,
						content: newPost.content,
						subject: newPost.subject,
						createDate: newPost.createDate,
						request:{
							type: 'POST',
							url: 'http://localhost:8000/post/' + newPost._id
						}
					}
				})
			})
			.catch(err => {
				res.status(500).json(err)
			})							
	},

	//UPDATE
	updatePostWithPath: function(req, res){
		let post_id = req.body.post_id;

		if(!mongoose.Types.ObjectId.isValid(post_id))
			return res.status(500).json({
				message: 'Something not correct!'
			})
		Post.updateOne({ _id: mongoose.Types.ObjectId(post_id)}, req.body)
			.then(() => {
				res.status(200).json({
					titleUpdate: req.body.title,
					contentUpdate: req.body.content,
					subjectUpdate: req.body.subject,
					createDateUpdate: req.body.createDate,
					request:{
						type: 'PATCH',
						url: 'http://localhost:8000/post/' + req.body._id
					}
				})
			})
			.catch(err => {
				res.status(500).json({
					message: err
				})
			})
	},

	//DELETE
	deletePost : function(req, res){
		let criteria = {}
		if(mongoose.Types.ObjectId.isValid(req.body.post_id)){
			criteria._id = mongoose.Types.ObjectId(req.body.post_id);

			Post.remove(criteria)
				.then( () => {
					res.json({
						message: "Delete post successfully"
					});
				})
				.catch( err => {
					res.status(500).json({
						message: err
					})
				})
		}
		else
			res.status(400).json({
				message: 'Not valid for your provider id'
			})
	}
}