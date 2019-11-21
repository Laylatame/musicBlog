let express = require("express"); 
let morgan = require("morgan"); 
let bodyParser = require('body-parser');
let uuid = require('uuid');
let mongoose = require("mongoose");
let bcrypt = require('bcryptjs');
var session = require('express-session');
var path = require('path');
const { DATABASE_URL, PORT } = require( './config' );
const BlogPost = require('./public/js/blogPost');
const VinylRecord = require('./public/js/vinylRecord');
const User = require('./public/js/user');
const FavReview = require('./public/js/favReview');

let app = express();
let jsonParser = bodyParser.json();
app.set("view engine", "ejs");
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static('public'));
app.use(morgan("dev"));
app.use(jsonParser);

// Views

app.get('/', function(req, res) {
    req.session.destroy();
    res.render('index');
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//Get all reviews
app.get("/api/blog-posts", (req, res) => {
    if(req.session.loggedin){

        return BlogPost.find({}).sort({publishDate: 'desc'}).exec(function(err, blogPosts) {
            if(err) {
                res.statusMessage = "Something went wrong with the DB. Try again later.";
                return res.status( 500 ).json({
                    status : 500,
                    message : "Something went wrong with the DB. Try again later."
                });
            } else {
                return res.status(200).json(blogPosts);
            }
        });
    }
    return res.status(404).json({message: "Not logged in", status: 404});
});

//Get favorite reviews
app.get("/api/getFavorites", (req, res) => {
    if(req.session.loggedin){

        return FavReview.find({}).sort({publishDate: 'desc'}).exec(function(err, favReviews) {

            if(err) {
                res.statusMessage = "Something went wrong with the DB. Try again later.";
                return res.status( 500 ).json({
                    status : 500,
                    message : "Something went wrong with the DB. Try again later."
                });
            } else {
                return res.status(200).json(favReviews);
            }
        });
    }
    return res.status(404).json({message: "Not logged in", status: 404});
});

//Get reviews by user
app.get("/api/getUserReviews", jsonParser, (req, res, next) => {
    if(req.session.loggedin){

        return BlogPost.find({}).sort({publishDate: 'desc'}).exec(function(err, blogPosts) {
            if(err){
                res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : "Something went wrong with the DB. Try again later."
                    });
            } else {
                if (!blogPosts){
                    res.statusMessage = "User has no reviews.";
                    return res.status(202).json({});
                } else {                
                    return res.status(201).json({blogPosts: blogPosts, username: req.session.username});
                }
            }
        });
    }
    return res.status(404).json({message: "Not logged in", status: 404});
})



/*
app.get("/api/blog-post", (req, res) => {

    let author = req.query.author;

    if(! author){
        return res.status(406).json({message: "Missing author in params", status:406});
    }

    let postsAuthor = posts.filter(post => post.author == author);

    if (postsAuthor.length == 0) {
        return res.status(404).json({message: "Author not found", status: 404});
    }

    return res.status(200).json({message: postsAuthor, status: 200});

});
*/


app.post("/api/register", jsonParser, (req, res, next) => {

    let { username, password } = req.body;

    User.findOne({username : username}, function (err, user) {
        if (!user){
            return bcrypt.hash(password, 10).then(hash => {
                //Create new entry on the database
                let user = new User({username: username, password: hash});
        
                return user.save(function (err, user) {
                    if (err) return console.error(err);
                    return res.status(201).json({message: "Success", status: 201});
                });
            });
        } else {                
            return res.status(409).json({message: "Username is taken.", status: 409});
        }
    });
});


app.post('/api/auth', function(req, res) {

    let { username, password } = req.body;

	if (username && password) {
        return bcrypt.hash(password, 10).then(hash => {
            let user = User.findOne({username: username}, function(err, user){
                if(err) {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : "Something went wrong with the DB. Try again later."
                    });
                } else {
                    if(!bcrypt.compareSync(password, user.password)){
                        return res.status(401).json({
                            status: 401,
                            message: "User or password is wrong."
                        })
                    } 
                    req.session.loggedin = true;
                    req.session.username = username;
                    return res.status(201).json(req.session.username);
                }
            });
        });
    }
});

//Add New Review
app.post("/api/blog-posts", jsonParser, (req, res) => {
    console.log(req.session.loggedin);

    let title = req.body.title;
    let content = req.body.content;
    let button = req.body.button;

    if (! title || ! content){
        return res.status(406).json({message: "Fields incomplete", status: 406});
    }

    BlogPost.new
    let blogPost = new BlogPost ({
        title: title,
        content: content,
        author: req.session.username,
        publishDate: new Date(),
        button: button
    });

    blogPost.save(function (err, blogPost) {
        if (err) return console.error(err);
        return res.status(201).json(req.session.username);
      });

});

//Add new favorite
app.post("/api/addFavorite", jsonParser, (req, res) => {

    let savedBy = req.session.username;
    let postId = req.body.postId;
    let title = req.body.title;
    let content = req.body.content;
    let publishDate = req.body.publishDate;
    let button = req.body.button;

    FavReview.new
    let favReview = new FavReview ({
        savedBy: savedBy,
        postId: postId,
        title: title,
        content: content,
        publishDate: publishDate,
        button: button
    });

    favReview.save(function (err, favReview) {
        if (err) return console.error(err);
        return res.status(201).json({message: "Success", status: 201});
      });

});

app.get("/api/deleteFavorite", (req, res) => {

    let savedBy = req.session.username;
    let postId = req.body.postId;

    return FavReview.find({"savedBy" : savedBy}, function (err, favReviews) {
            return res.status(201).json(favReviews);
        });
});

app.delete("/api/deleteFavorite", (req, res) => {

    let id = req.body.id;
    console.log(id);

    FavReview.deleteOne({_id:id}, function(err, favReview) {
        if(err) {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            });
        } else {
            return res.status(200).json(favReview);
        }
    });
});
    

app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
    
    let idB = req.body.id;
    let id = req.params.id;
    let content = req.body.content;

    if (!idB){
        return res.status(406).json({message: "Missing id in body", status: 406});
    }
    
    if(id != idB){
        return res.status(409).json({message: "Id in body and params don't match", status: 409});
    }

    if(content.title != undefined){
        if(content.content != undefined){
            BlogPost.findOneAndUpdate({"_id": id}, { "$set": { "title": content.title, "content": content.content}}).exec(function(err, blogPost){
                if(err) {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : "Something went wrong with the DB. Try again later."
                    });
                } else {
                    return res.status(201).json(blogPost);

                }
            });
        } else {
            BlogPost.findOneAndUpdate({"_id": id}, { "$set": { "title": content.title}}).exec(function(err, blogPost){
                if(err) {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : "Something went wrong with the DB. Try again later."
                    });
                } else {
                    return res.status(201).json(req.session.username);
                }
            });
        }
    } else {
        if(content.content != undefined){
            BlogPost.findOneAndUpdate({"_id": id}, { "$set": { "content": content.content}}).exec(function(err, blogPost){
                if(err) {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : "Something went wrong with the DB. Try again later."
                    });
                } else {
                    return res.status(201).json(blogPost);
                }
            });
        } else {
            return res.status(200).json({message: "Nothing to update", status: 200});
        }
    }
});



let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, { useNewUrlParser: true }, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
});

module.exports = { app, runServer, closeServer };

