let mongoose = require("mongoose");

var favReviewSchema = new mongoose.Schema ({
    savedBy: String,
    postId: String,
    title: String,
    content: String,
    publishDate: String,
    button: String
})

var FavReview = new mongoose.model('FavReview', favReviewSchema);
module.exports = FavReview;
