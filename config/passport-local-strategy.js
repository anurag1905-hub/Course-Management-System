var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');

var mysql = require('mysql');

var connection = require('../config/database');
    

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

        connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
            console.log(rows);
        if (err){
            console.log('Error');
            return done(err);
        }
        if (!rows.length) {
            console.log('User not found');
            return done(null, false);
        } 
        if (!( rows[0].pswd == password)){
            console.log('Wrong Password');
            return done(null, false);
        }
        else{
            return done(null, rows[0]);	
        }		
    
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    connection.query("select * from users where id = "+id,function(err,rows){	
        done(err, rows[0]);
    });
});

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //console.log('The info of the user is',req.user);
        //req.user contains the current signed in user from the sesion cookie. It is handled by passport. And we are just sending this to the locals for the views.
        res.locals.user = req.user;
    }
    next();
}




module.exports = passport;