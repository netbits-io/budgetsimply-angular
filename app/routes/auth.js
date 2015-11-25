var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {
    
    var authRouter = express.Router();
    
    // route to generate sample user
    authRouter.post('/sample', function (req, res) {
        // look for the user named chris
        User.findOne({'email': 'chris'}, function (err, user) {
            // if there is no chris user, create one
            if (!user) {
                var sampleUser = new User();
                sampleUser.name = 'chris';
                sampleUser.email = 'chris';
                sampleUser.password = 'supersecret';
                sampleUser.admin = 'true';
                 console.log("newuser");
                console.log(sampleUser);
                sampleUser.save();
            } else {
                 console.log("existinguser");
                console.log(user);
                // if there is a chris, update his password
                user.password = 'supersecret';
                user.save();
            }
        });
    });
    
    // register user route
    authRouter.post('/register', function (req, res) {
        var user = new User();
        user.name = req.body.name; 
        user.email = req.body.email;  
        user.password = req.body.password; 
        user.save(function (err) {
            if (err) {
                if (err.code == 11000){
                    return res.json({success: false, message: 'A user with that email already exists.'});
                }else{
                    return  res.json({success: false, message: 'Could not create user.'});
                }
            }
            res.json({success: true, message: 'User created!'});
        });
    });

    // route to authenticate a user
    authRouter.post('/authenticate', function (req, res) {
        // find the user
        User.findOne({
            email: req.body.email
        }).select('name email password admin').exec(function (err, user) {
            if (err)
                throw err;
            // no user with that email was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        name: user.name,
                        email: user.email,
                        admin: user.admin
                    }, superSecret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });
    
    return authRouter;
};