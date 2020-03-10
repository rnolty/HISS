var createError = require('http-errors');
var express = require('express');
//var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
//var HISScron = require('./cron/HISScron');    // just requiring it makes it work

var MongoClient = require('mongodb').MongoClient;
var cors = require('cors')

var router = require('./routes');

var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
// I'm not actually using a view engine, but express seems to insist I give a valid one
app.set('view engine', 'pug');




//////// open DB connection and make it available to all routes
const url = 'mongodb://localhost:27017';
const dbName = "HISS";
let db, client;

function connectCallback(err, clientIn) {
    if (err) {
	console.log("Connecting to Mongo: ",err);
	return;
    }

    console.log("app connected to Mongo");
    client = clientIn;               // set global variable
    db = client.db(dbName);          // set global variable
}

// this option squashes a warning
MongoClient.connect(url, { useNewUrlParser: true }, connectCallback);

function attachDBMiddleware(req, res, next) {
    req.db = db;
    next();
}

function massageItemList(req, res, next) {
    if (res.listOfItems) {
	for (item of res.listOfItems) {
            if (item && item.header) {               // skip any malformed items that got into DB
                item.header.id = item._id;
                delete item._id;
            }
	}
	// TODO: flag overdue TODO items
    }
    next();
}

app.use(cors())
//app.use(logger('dev'));
app.use(express.json());       // creates 'req.body' w JSON-derived object (is actually body-parser.json)
app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(attachDBMiddleware);
app.use('/',router);

// if we get here, router missed it so it is 404
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
