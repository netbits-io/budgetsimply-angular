var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {
    var userRouter = express.Router();

    // api endpoint to get user information
    userRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });
    
    return userRouter;
};