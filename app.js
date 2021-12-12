// load semua variabel env dari file .env
require('dotenv').config();

const express = require('express');
const app = express();

const passport = require('passport');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { responseApiError } = require('./utils/response-handler');
const bodyParser = require('body-parser');
const cors = require('cors');

// allow all origin
app.use(cors());


// error handling
app.use(function(err, req, res, next) {
    responseApiError(res,err);
    res.done();
})

app.use(logger('dev'));
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit:"5mb"}))


// passport to middleware
app.use(passport.initialize());

// passport configuration
require('./auth');

// define route disini
// require('./routes/users.route')(app);
// require('./routes/users')(app);
require('./routes/index')(app);


module.exports = app;

