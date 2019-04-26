const Post = require('../../models/post.model');

module.exports = {

    getPosts: async function(req, res){
        var posts = await Post.find();
        res.json(posts);
    },
    
    findPosts: async function(req, res){
        var findCriteria = { "subject": "Javascript", $and: [{ "tags": "Javascript"}, {"tags": "ES6"}] };
        var result = await Post.find(findCriteria);
        res.json(result);
    },

    getCreateNewPost: function(req, res, next){
        res.render('createPost');
    },

    postCreateNewPost: async function(req, res){
        var newPost =  new Post({
            title: req.body.title,
            subject: req.body.subject,            
            content: req.body.content,
            status: req.body.status
        })

        var result =  await newPost.save();       
        res.json(result);
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