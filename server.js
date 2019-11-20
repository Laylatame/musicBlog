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

})


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
                    return res.status(201).json(req.session);
                }
            });
        });
    }
});

app.post("/api/blog-posts", jsonParser, (req, res) => {
    console.log(req.session.loggedin);


    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if (! title || ! content || ! author || ! publishDate){
        return res.status(406).json({message: "Fields incomplete", status: 406});
    }

    BlogPost.new
    let blogPost = new BlogPost ({
        title: title,
        content: content,
        author: author,
        publishDate: publishDate
    });

    blogPost.save(function (err, blogPost) {
        if (err) return console.error(err);
        return res.status(201).json({message: "Success: " + title + " was added.", status: 201});
      });

});

/*
app.delete("/api/blog-posts/:id", (req, res) => {

    let id = req.params.id;
    
    for(let i=0; i<posts.length; i++){
        if (posts[i].id == id){
            posts = posts.filter(post => post.id != id);
            return res.status(200).json({message: "Blog removed.", status: 200});
        }
    }

    return res.status(404).json({message: "Blog not found.", status: 404});
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

    for (let i=0; i<posts.length; i++){
        if (posts[i].id == id){
            if(content.title != undefined){posts[i].title = content.title;}
            if(content.content != undefined){posts[i].content = content.content;}
            if(content.author != undefined){posts[i].author = content.author;}
            if(content.publishDate != undefined){posts[i].publishDate = new Date(content.publishDate);}
            return res.status(202).json({message: "Object updated: " + posts[i].title, status: 202});
        }
    }

    return res.status(406).json({message: "Blog not found ", status: 406});
});
*/

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



//Checar si hay sesion, si no mandar a login
//Quitar autor, agarrar el autor de la sesion
//Si no hay sesion login y register, quitar logout
//Si hay sesiòn logout, quitar login y register