var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
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
                if (err.code == 11000) {
                    return res.json({success: false, message: 'A user with that email already exists.'});
                } else {
                    return  res.json({success: false, message: 'Could not create user.'});
                }
            }
            res.json({success: true, message: 'User created!'});
        });
    });

    // reset password route
    authRouter.post('/reset', function (req, res) {
        User.findOne({resetPasswordToken: req.body.token, resetPasswordExpires: {$gt: Date.now()}}, function (err, user) {
            if (!user) {
                return  res.json({success: false, message: 'Password reset token is invalid or has expired.'});
            }
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function (err) {
                if (err) {
                    return  res.json({success: false, message: 'Could not update your password.'});
                } else {
                    return  res.json({success: true, message: 'Password updated.'});
                }
            });
        });
    });

    // forgot password route
    authRouter.post('/forgot', function (req, res) {
        console.log('start reset ' + req.body.email);
        crypto.randomBytes(20, function (err, buf) {
            if (!err) {
                token = buf.toString('hex');
                console.log('token is ' + token);
                User.findOne({email: req.body.email}, function (err, user) {
                    if (err || !user) {
                        console.log('no user found ');
                        return res.json({success: false, message: 'No account with that email address exists.'});
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    user.save(function (err) {
                        console.log('saved user, err ' + err);
                        if (err) {
                            return res.json({success: false, message: err});
                        } else {
                            var smtpTransport = nodemailer.createTransport({
                                service: config.mailservice,
                                auth: {
                                    user: config.mailuser,
                                    pass: config.mailpass
                                }
                            });
                            smtpTransport.sendMail({
                                to: req.body.email,
                                subject: 'Confirm Password Reset',
                                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                        'http://budgetsimply.io/reset/' + token + '\n\n' +
                                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            }, function (err) {
                                console.log('sent mail, err ' + err);
                                if (err) {
                                    return res.json({success: false, message: err});
                                }
                                return res.json({success: true, message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'});
                            });
                        }
                    });
                });
            }
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