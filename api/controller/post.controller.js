var mongoose = require('mongoose');
const Post = require('../../models/post.model');

module.exports = {

	getPosts: function (req, res) {
		Post.find({}).select({
			views: 0
		}).exec((err, data) => {
			if (err) {
				return res.json({
					result: "failed",
					data: {},
					message: `Error is ${err}`
				})
			}
			return res.json({
				result: "success",
				data,
				message: `Get posts successfully`
			});
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
					message: "Not found"
				})
			})
			.catch(err => {
				res.json(err)
			})
	},

	getPostsById: function (req, res) {
		Post.findById(mongoose.Types.ObjectId(req.query.post_id)).exec((err, data) => {
			if (err) {
				return res.json({
					result: "failed",
					data: {},
					message: `Error is ${err}`
				})
			}
			return res.json({
				result: "success",
				data,
				message: `Insert new Post successfully`
			});
		})
	},

	findPostsWithCriteria: function (req, res) {
		var findCriteria = {
			title: new RegExp(req.query.title, 'i')
		};

		Post.find(findCriteria).exec((err, data) => {
			if (err) {
				return res.json({
					result: "failed",
					data: {},
					message: `Error is ${err}`
				})
			}
			return res.json({
				result: "success",
				data,
				message: `success`
			})
		});
	},

	postCreateNewPost: function (req, res) {
	
		let newPost = new Post({
			title: req.body.title,
			subject: req.body.subject,
			content: req.body.content,
			status: req.body.status
		})

		newPost.save()
			.then(data => {
				if (!data || data.length === 0)
					return res.status(500).json(data)
				res.status(201).json(data)
			})
			.catch(err => {
				res.status(500).json(err)
			})							
	},

	updatePost: function (req, res) {
		var criteria = {}
		if (mongoose.Types.ObjectId.isValid(req.body.post_id)) {
			criteria = {
				_id: mongoose.Types.ObjectId(req.body.post_id)
			}
			var newValue = {
				title: req.body.title,
				subject: req.body.subject,
				content: req.body.content,
				status: req.body.status
			}

			Post.findOneAndUpdate(criteria, newValue, { new: true})
				.then( data => {
					res.json(data);
				})
				.catch( err => {
					res.json(err);
				}) 
		}
		else
			res.status(400).json({
				message: 'Post id is not correct'
			})
	},


	//DELETE

	deletePost : function(req, res){
		let criteria = {}
		if(mongoose.Types.ObjectId.isValid(req.body.post_id)){
			criteria._id = mongoose.Types.ObjectId(req.body.post_id);

			Post.findOneAndRemove(criteria)
				.then( data => {
					res.json({
						removeData: data
					});
				})
				.catch( err => {
					res.status(500).json(err)
				})
		}
		else
			res.status(400).json({
				message: "Your Post's id is not correct"
			})
	}
}