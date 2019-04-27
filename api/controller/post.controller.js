const Post = require('../../models/post.model');

module.exports = {

    getPosts: function(req, res){
        Post.find({}).select({
            views: 0
        }).exec( (err, data) => {
            if (err){
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
        });        
    },
    
    getPostsById: function(req, res){
        Post.findById(require('mongoose').Types.ObjectId(req.query.post_id)).exec((err, data) => {
            if (err){
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

    findPostsWithCriteria: function(req, res){
        var findCriteria = { 
            title: new RegExp(req.query.title, 'i') 
        };

        Post.find(findCriteria).exec((err, data) => {
            if (err){
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
            })
        });        
    },

    getCreateNewPost: function(req, res, next){
        res.render('createPost');
    },

    postCreateNewPost: function(req, res){
        var newPost =  new Post({
            title: req.body.title,
            subject: req.body.subject,            
            content: req.body.content,
            status: req.body.status
        })

        newPost.save((err, data) => {
            if (err)
                return res.json({
                    result: "failed",
                    data: {},
                    message: `Error is ${err}`
                })
            return res.json({
                result: "success",
                data,
                message: `Insert new Post successfully`
            });
            
        });       
        
    },

    removePost: async function(req, res){
        var removeCriteria = {
            title: 'Route In NoteJS'
        }
            
        var result = await Post.deleteOne(removeCriteria)

        res.json(result);
    },

    updatePost: async function(req, res){
        var newValue = {
            title: "Route In NoteJS2",
            tags: ["NodeJs"]
        }

        var result = await Post.update({ "title": "Route In NoteJS"}, { $set: newValue}, {multi: true});
        res.json(result);
    }
}