/* Configuration */
var config = require('./config/db.js');
var port = process.env.PORT || 8001;

/* Express and HTTP listeners. */
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

/* Express and Body Parser */
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
        config.url, 
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

/* Authentication Setup */
var requireSession = require('./serverjs/authentication/passport.js')(app, repository);

/* io setup. */
io.on(
    'connection', 
    function(socket){
        socket.on(
            'chat-message', 
            function(message)
            {
                socket.broadcast.emit('chat-message', message)
                console.log(message)
            }
        );
        
        console.log('user joined');
    }
);

/* Handlebar view engine and public directory setup. */
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'));


/* URL Routing and Controllers. */
require('./controllers/homeController.js').setup(app, repository, requireSession);

/* Server starting point. */
http.listen(
    port, 
    function(){
        console.log('Listening correctly on port ' + port)
    }
);