/* Configuration */
var config = require('./config/db.js');
var port = process.env.PORT || 8001;

/* Express and HTTP listeners. */
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

/* Handlebar view engine and public directory setup. */
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'));

/* URL Routing. */
app.get('/', 
    function(req, res)
    {
        res.render('index', { name : 'Jose Angel' });
    }
);

/* Server starting point. */
app.listen(
    port, 
    function(){
        console.log('Listening correctly on port ' + port)
    }
);