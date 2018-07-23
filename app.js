var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// added
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// MULTER ===> handle file uploads
var upload = multer({dest: './uploads'});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// EXPRESS-SESSION ===> hanlde express sessions
app.use(session({
    secret: 'secret',
    saveUninitialized:true,
    resave:true
}));

// PASSPORT ===> passport
app.use(passport.initialize());
app.use(passport.session());

// EXPRESS-VALIDATOR ===> validator
//app.use(expressValidator(middlewareOptions));
app.use(expressValidator({
    errorFormatter:function(param, msg, value, location) {
            var namespace   = param.split('.')
            , root          = namespace.shift()
            , formParam     = root;

        while(namespace.lenght) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value,
            location: location
        }
    }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// CONNECT-FLASH ===> flash
app.use(flash());
// express-messages
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
