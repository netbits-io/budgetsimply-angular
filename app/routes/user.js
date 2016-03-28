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
                Friendship.find({'users.email': req.decoded.email, 'accepted': true, 'rejected': false}, function (err, friendships) {
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

    userRouter.get('/frequests', function (req, res) {
        Friendship.find({'users.email': req.decoded.email, 'accepted': false, 'rejected': false}, function (err, friendships) {
            if (err) {
                res.json({success: false, message: "Internal error!"});
            } else {
                nfs = [];
                friendships.filter(function(fship){
                    fship.users.filter(function(item){

                        if(item.email != req.decoded.email){
                            nfs.push({id: fship._id, email: item.email, name: item.name, accepted: item.accepted});
                        }
                    });
                });
                res.send({success: true, requests: nfs});
            }
        });
    });

    userRouter.post('/faccept', function (req, res) {
        me = req.decoded;
        fmail = req.body.email;
        fid = req.body.fid;
        Friendship.findOne({ _id: fid}, function (err, request) {
            if (err) res.json({success: false, message: 'Could not accept friend request!'});
            else if(request){
                if(request.accepted != true && request.rejected != true){
                    verified = 0;
                    request.users.forEach(function(usr){
                        if(usr.email == fmail){
                            verified++;
                        }
                        if(usr.email == me.email){
                            verified++;
                        }
                    });
                    if(verified === 2){
                        request.accepted = true;
                        request.users.forEach(function(usr){
                            usr.accepted = true;
                        });
                        request.save(function (err) {
                            if (err) res.json({success: false, message: 'Could not accept friend request!'});
                            else res.json({success: true, message: 'Friend request accepted!'});
                        });
                    } else {
                        res.json({success: false, message: 'Could not accept friend request!'});
                    }
                } else {
                    res.json({success: false, message: 'Friend request is already accepted or rejected!'});
                }
            } else {
                res.json({success: false, message: 'Could not accept friend request!'});
            }
        });
});

userRouter.post('/freject', function (req, res) {
        me = req.decoded;
        fmail = req.body.email;
        fid = req.body.fid;
        Friendship.findOne({ _id: fid}, function (err, request) {
            if (err) res.json({success: false, message: 'Could not reject friend request!'});
            else if(request){
                if(request.accepted != true && request.rejected != true){
                    verified = 0;
                    request.users.forEach(function(usr){
                        if(usr.email == fmail){
                            verified++;
                        }
                        if(usr.email == me.email){
                            verified++;
                        }
                    });
                    if(verified === 2){
                        request.rejected = true;
                        request.save(function (err) {
                            if (err) res.json({success: false, message: 'Could not reject friend request!'});
                            else res.json({success: true, message: 'Friend request rejected!'});
                        });
                    } else {
                        res.json({success: false, message: 'Could not reject friend request!'});
                    }

                } else {
                    res.json({success: false, message: 'Friend request is already accepted or rejected!'});
                }
            } else {
                res.json({success: false, message: 'Could not reject friend request!'});
            }
        });
});

userRouter.post('/friend', function (req, res) {
    me = req.decoded;
    fMail = req.body.email;
    User.findOne({'email': me.email}, function (err, user) {
        if (user) {
            already = false;
            // TODO already friends
            // TDO pending friend request
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