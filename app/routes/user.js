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
        User.findOne({'email': req.decoded.email}, function (err, user) {
            if (user) {
                res.send(user);
            } else {
                res.send(req.decoded);
            }
        });
    });

    userRouter.post('/friend', function (req, res) {
        me = req.decoded;
        fMail = req.body.email;
        console.log(me);
        User.findOne({'email': me.email}, function (err, user) {
            if (user) {
                already = false;
                user.friends.filter(function (el) {
                    console.log(el);
                    if(el.email === fMail){
                        already = true;
                    }
                });
                if(already){
                    res.json({success: false, message: 'You are already friends with: '+fMail});
                } else {
                    User.findOne({'email': fMail}, function (err, friend) {
                        if (friend) {
                            user.friends.push({ email: friend.email, name: friend.name, accepted: false, date: new Date() });
                            user.save();
                            res.json({success: true, message: 'Friend request sent!'});
                        } else {
                            res.json({success: false, message: 'Could not find a User for the email: '+fMail});
                        }
                    });
                }
            } else {
                res.json({success: false, message: 'Could not add friend!'});
            }
        });
    });
    
    return userRouter;
};