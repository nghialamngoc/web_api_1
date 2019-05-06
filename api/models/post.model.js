const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,   
        required: true
    },    
    content: {
        type: String,
        default: ""
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['enable', 'disable']
        }],
        default: ['disable']
    },
    tags: {
        type:[{
            type: String
        }]
    }
})

//a setter
postSchema.path('title').set((inputString) => inputString[0].toUpperCase() + inputString.slice(1));

const Post = mongoose.model('Post', postSchema)

module.exports = Post;