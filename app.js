var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = require('http');


const swaggerUi = require('swagger-ui-express');
var cors = require('cors');
var mongoose = require('mongoose');

var app = express();

//Swagger
const swaggerDocument = require('./docs/swaggerUI.json');
//CORS
var corsOptions = {
    origin: ['*'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    allowedHeaders: ['Content-Type', 'Authorization', 'application/x-www-form-urlencoded'],
    credentials: true
}

// database connection
let options = {
    useNewUrlParser: true
};
mongoose.Promise = global.Promise;
mongoose.connect('<URI>', options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('We\'re connected!');
});

app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//Write Routes here

// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

let port = process.env.port || 8000;
let backend = server.createServer(app).listen(port);

module.exports = app;
