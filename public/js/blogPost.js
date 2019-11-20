let mongoose = require("mongoose");

var blogPostSchema = new mongoose.Schema ({
    title: String,
    content: String,
    author: String,
    publishDate: Date
})

var BlogPost = new mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
