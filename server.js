// BASE SETUP
// ======================================
var express    = require('express');		
var app        = express(); 		
var bodyParser = require('body-parser'); 
var morgan     = require('morgan'); 
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path 	   = require('path');

// APP CONFIGURATION ==================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database 
mongoose.connect(config.database); 

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// API ROUTES ------------------------
var authRoutes = require('./app/routes/auth')(app, express);
var secureMdw = require('./app/routes/secure')(app, express);
var userRoutes = require('./app/routes/user')(app, express);
var adminRoutes = require('./app/routes/admin')(app, express);
var budgtRoutes = require('./app/routes/budget')(app, express);

app.use('/api/auth', authRoutes);
app.use('/api', secureMdw);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/budgt', budgtRoutes);

// MAIN CATCHALL ROUTE --------------- 
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
app.listen(config.port);