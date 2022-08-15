const express = require('express');
const app = express();
const port = 8000;
const passport = require('passport');
const LocalStrategy = require('./config/passport-local-strategy');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
var MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(cookieParser());

app.use(session({
    key:'session_cookie_name',
    secret:'session_cookie_secret',
    store: new MySQLStore({
        host:'localhost',
        user:'root',
        password:'',
        database:'CMS'
    }),
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('./assets'));

app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes'));




app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server');
    }
    else{
        console.log(`Server is running successfully on port number ${port}`);
    }
});
