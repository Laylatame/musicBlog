let mongoose = require("mongoose");

var userSchema = new mongoose.Schema ({
    username: String,
    password: String
});

var User = new mongoose.model('User', userSchema);
module.exports = User;