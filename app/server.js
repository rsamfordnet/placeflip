/* Configuration */
var config = require('./config/db.js');
var port = process.env.PORT || 8001;

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
var /* middleware */ requireSession = require('./serverjs/authentication/passport.js')(app, repository);

/* io setup. */
var userSockets = {};

io.on(
    'connection', 
    function(socket){
        socket.on(
            'chat-start',
            function(userName)
            {
                console.log('user ' + userName + 'joined the chat');
            }
        );
        
        socket.on(
            'chat-join', 
            function(message)
            {
                var roomName = message.roomName;
                var userName = message.userName;
                
                userSockets[this.id] = 
                    {   
                        userName : userName, 
                        roomName : roomName 
                    };
                
                socket.broadcast.in(roomName).emit('chat-join', message)
                
                console.log(userName + ' joined to ' + roomName);
                socket.join(roomName);
            }
        );

        socket.on(
            'chat-typing',
            function(data)
            {
                socket.broadcast.in(data.roomName).emit('chat-typing', data);
                console.log(data);
            }
        );
        
        socket.on(
            'chat-message', 
            function(message)
            {
                socket.broadcast.in(message.roomName).emit('chat-message', message);
                console.log(message)
            }
        );
        
        socket.on(
            'disconnect',
            function()
            {
                var userSocket = userSockets[this.id];
                if (userSocket == undefined)
                    return;
                    
                console.log(userSocket.userName + ' is offline.');
                
                socket
                    .broadcast
                    .in(userSocket.roomName)
                    .emit('chat-leave', userSocket.userName);
                
                delete userSockets[this.id];
            }
        );
    }
);

io.on

/* Handlebar view engine and public directory setup. */
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'master', extname: '.hbs'}));
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