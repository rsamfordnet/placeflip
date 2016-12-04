/* Configuration */
var config = require('./serverjs/config/db.js');
var port = process.env.PORT || 8002;

/* Express and HTTP listeners. */
var express = require('express');
var app     = express();
var http    = require('http').Server(app);

/* Chat configuration. */
var io    = require('socket.io')(http);

/* Express and Body Parser */
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/* Sockets */
var socketContext = require('./serverjs/socketevents/socketContext.js')(io);

/* Classes */
/* class */ const Repository = require('./serverjs/data/Repository.js')

/* Handlebar view engine and public directory setup. */
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'master', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'));

/* Data Repository */
var repository = new Repository(onRepositoryReady);
function onRepositoryReady()
{
    /* Authentication Setup */
    var /* middleware */ requireSession = require('./serverjs/authentication/passport.js')(app, repository);

    /* URL Routing and Controllers. */
    require('./serverjs/controllers/homeController.js').setup(app, repository, requireSession);
    require('./serverjs/controllers/chatController.js').setup(app, repository, requireSession, userSockets);
    require('./serverjs/controllers/userController.js').setup(app, repository, requireSession, userSockets);
    require('./serverjs/controllers/profileController.js').setup(app, repository, requireSession, userSockets);
}


/* Server starting point. */
http.listen(
    port, 
    function(){
        console.log('Listening correctly on port ' + port)
    }
);