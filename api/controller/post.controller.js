const mongoose = require('mongoose');

//Model
const Post = require('../models/post.model');

module.exports = {

	getPosts: function (req, res, next) {
		Post.find().select({ __v: 0 })
			.then(data => {
				const respone = {
					count: data.length,
					data: data.map(data => {
						return {
							_id: data._id,
							title: data.title,
							content: data.content,
							shortDescription: data.shortDescription,
							createDate: data.createDate,
							postImages: data.postImages,
							tags: data.tags,
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

	searchParam: function (req, res) {
		
		let searchParam = req.params.searchParam;
		console.log(searchParam)
		if(mongoose.Types.ObjectId.isValid(searchParam))		
			Post.findById({ _id: mongoose.Types.ObjectId(searchParam)}).select({ __v: 0 })		
				.then(data => {				
					const result = {
						count: data.length,
						title: data.title,
						content: data.content,
						shortDescription: data.shortDescription,
						createDate: data.createDate,
						request: {
							type: 'GET',
							url: 'http://localhost:8000/post/' + data._id
						}
					}				
					res.status(200).json(result)
				})
				.catch(err => {
					res.status(500).json({
						message: err
					})
				});		
		else 
			Post.find({ tags: searchParam}).select({ __v: 0 })		
				.then(data => {				
					const respone = {
						count: data.length,
						data: data.map(data => {
							return {
								_id: data._id,
								title: data.title,
								content: data.content,
								shortDescription: data.shortDescription,
								createDate: data.createDate,
								postImages: data.postImages,
								tags: data.tags,
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
						message: err
					})
				});						
	},

	//POST
	postCreateNewPost: function (req, res) {
		let newPost = new Post({
			_id: mongoose.Types.ObjectId(),
			title: req.body.title,
			shortDescription: req.body.shortDescription,
			createDate: req.body.createDate,
			content: req.body.content,
			tags: req.body.tags.split(','),
			postImages: req.file ? 'uploads/' + req.file.filename : ''
		})

		newPost.save()
			.then(() => {
				res.status(201).json({
					message: 'Create new post successfully',
					newPost: {
						title: newPost.title,
						content: newPost.content,
						shortDescription: newPost.shortDescription,
						createDate: newPost.createDate,
						tags: newPost.tags,
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
					shortDescriptionUpdate: req.body.shortDescription,
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
		if(mongoose.Types.ObjectId.isValid(req.params.post_id)){
			criteria._id = mongoose.Types.ObjectId(req.params.post_id);

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