var cookieParser = require('cookie-parser');
var session      = require('express-session');

module.exports = function(app, repository)
{
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
    
    var passport      = require("passport");
    var LocalStrategy = require('passport-local').Strategy;
    
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
                        console.log('login failed');
                        
                        if (done)
                            done(null, null, {message : "Authentication Error"});
                    }
                );
            }
        )          
    );
    
    var requireSessionMiddleware = function(req, res, next){
        if (!req.isAuthenticated())
        {
            return res.redirect("/login");
        }
        
        next();
    };
    
    requireSessionMiddleware.passport = passport;
    
    return requireSessionMiddleware;
}