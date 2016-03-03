var bodyParser = require('body-parser'); 	// get body-parser
var User = require('../models/user');
var Friendship = require('../models/friendship');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {
    var userRouter = express.Router();

    // api endpoint to get user information
    userRouter.get('/me', function (req, res) {
        User.findOne({'email': req.decoded.email}).lean().exec(function (err, user) {
            if (user) {
                Friendship.find({'users.email': req.decoded.email}, function (err, friendships) {
                    if (err) res.json({success: false, message: "Internal error!"});
                    else {
                        nfs = [];
                        friendships.filter(function(fship){
                            fship.users.filter(function(item){
                                if(item.email != req.decoded.email){
                                    nfs.push({ email: item.email, name: item.name, accepted: item.accepted});
                                }
                            });
                        });
                        user.friends = nfs;
                        res.send(user);
                    }
                });

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

                if(already){
                    res.json({success: false, message: 'You are already friends with: '+fMail});
                } else {
                    User.findOne({'email': fMail}, function (err, friend) {
                        if (friend) {

                            var link = new Friendship();
                            link.users.push({ email: friend.email, name: friend.name, accepted: false });
                            link.users.push({ email: user.email, name: user.name, accepted: true });
                            link.accepted = false;
                            link.date = new Date();
                            link.rejected = false;
                            link.save();
                            
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