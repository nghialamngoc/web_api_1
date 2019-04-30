const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: ""
    },
    status: {
        type: [{
            type: String,
            enum: ['enable', 'disable']
        }],
        default: ['disable']
    },
    tags: {
        type: Array
    },
    views: {
        type: Number,
        default: 0
    }
})

//a setter
postSchema.path('title').set((inputString) => inputString[0].toUpperCase() + inputString.slice(1));

const Post = mongoose.model('Post', postSchema)

module.exports = Post;