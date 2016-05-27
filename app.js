var port = process.env.PORT || 8001;

/* Config section. */
var dbConfig = require('./config/db.js');

/* Express */
var express         = require('express');
var app             = express();
var cookieParser    = require('cookie-parser');
var session         = require('express-session');

/* Express Body - Express */
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/* Mongo */
var mongodb 	    = require('mongodb');
var mongoClient     = mongodb.MongoClient;

/* Data Repository */
var repository = require('./rep/init.js')
    .create(
        dbConfig.url, 
        mongoClient,
        function()
        {
            require('./rep/mongodb/users.js').in(repository);
        },
        function (error)
        {
            console.log(error);
        }
    );


var passport      = require("passport"), 
    LocalStrategy = require('passport-local').Strategy;
    
app.use(cookieParser());
app.use(
    session
    (
        {
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }
    )
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(username, password, done) {
            repository.users.validate(
                username, 
                password, 
                function(user){
                    done(null, user);
                },
                function(error){
                    done(null, false, {message : "Authentication Error"});
                }
            );
        }
    )          
);


var requireSession = function(req, res, next){
    if (!req.isAuthenticated())
    {
        return res.redirect("login");
    }
       
        
    next();
}

/* Controllers */
require('./controllers/homeController.js').setup(app, repository, passport, requireSession);

/* Express app settings section. */
app.set('view engine', 'ejs');  
app.use(express.static('public'));

/*
var middlewareLogger = function(request, response, next)
{
	request.yeaharry = 1;

	console.log('LOGGED');
	next();
};

app.use(middlewareLogger);

app.get("/teams", 
	function(req, res){
		db.collection("teams").find().toArray(
    		function(error, teams)
    		{
				console.log(teams.length + " teams.");
				res.send(teams);
    		}
    	);
	}
);

app.post("/teams",
	function(req, res){
		db.collection("teams").insertOne(
        	req.body, 
        	function(err, result)
        	{}
    	);
	}
);

app.delete("/teams",
	function(req, res){
		db.collection("teams").remove( { name : req.body.name } );
	}
);
*/

/* Listen on 8001 */
app.listen(
		8001, 
		function(){
			console.log('Listening on 8001');
		}
	);
