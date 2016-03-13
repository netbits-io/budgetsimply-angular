var bodyParser = require('body-parser');
var Expense = require('../models/expense');
var config = require('../../config');

module.exports = function (app, express) {
    var expenseRouter = express.Router();

    expenseRouter.route('/')
            .post(function (req, res) {
                if(req.body.expid == null){
                    var expense = new Expense();
                    expense.date = req.body.date;
                    expense.note = req.body.note;
                    expense.owner = req.decoded.email;
                    expense.amount = req.body.amount;
                    expense.shares = req.body.shares;
                    for(var i = expense.shares.length - 1; i >= 0; i--) {
                        console.log(expense.shares[i].user);
                        if(expense.shares[i].user === req.decoded.email) {
                            expense.shares.splice(i, 1);
                        }
                    }
                    forme = req.body.amount;
                    req.body.shares.filter(function(el){
                        forme = forme - el.amount;
                    });
                    expense.shares.push({user: req.decoded.email, accepted: true, amount: forme, payback: false});
                    expense.shares.filter(function(el){
                        el.tags = req.body.tags;
                    });
                    expense.accepted = (expense.shares.length == 1);
                    expense.shares.forEach(function(share){
                        share.accepted = (share.user === req.decoded.email);
                    });
                    if(expense.amount < 0 || forme < 0){
                        res.json({success: false, message: 'Invalid Expense amount(s)!'});
                    } else {
                        expense.save(function (err) {
                            if (err) res.json({success: false, message: 'Could not update expense!'});
                            else res.json({success: true, message: 'Expense saved!'});
                        });
                    }

                } else {
                    Expense.findOne({owner: req.decoded.email, _id: req.body.expid}, function (err, expense) {
                    if (err) res.json({success: false, message: err.code});
                    else if(expense){
                        expense.date = req.body.date;
                        expense.note = req.body.note;
                        expense.amount = req.body.amount;
                        for(var i = expense.shares .length - 1; i >= 0; i--) {
                            if(expense.shares[i].user === req.decoded.email) {
                                expense.shares.splice(i, 1);
                            }
                        }
                        // keep the old tags
                        for(var i = req.body.shares - 1; i >= 0; i--) {
                            for(var p = expense.shares - 1; p >= 0; p--) {
                                if(req.body.shares[i].user === expense.shares[p].user ) {
                                    expense.shares[p].tags = req.body.shares[p].tags; 
                                }
                            }
                        }
                        expense.shares = req.body.shares;
                        forme = req.body.amount;
                        req.body.shares.filter(function(el){
                            forme = forme - el.amount;
                        });
                        expense.shares.push({user: req.decoded.email, accepted: true, amount: forme, payback: false, tags: req.body.tags});
                        expense.accepted = (expense.shares.length == 1);
                        expense.shares.forEach(function(share){
                            share.accepted = (share.user === req.decoded.email);
                        });
                        if(expense.amount < 0 || forme < 0){
                            res.json({success: false, message: 'Invalid Expense amount(s)!'});
                        } else {
                            expense.save(function (err) {
                                if (err) res.json({success: false, message: 'Could not update expense!'});
                                else res.json({success: true, message: 'Expense saved!'});
                            });
                        }

                    } else {
                        res.json({success: false, message: 'Could not update expense!'});
                    }
                });

                }

            })
            .get(function (req, res) {
                Expense.find({owner: req.decoded.email}, function (err, expenses) {
                    if (err) res.json({success: false, message: err.code});
                    else res.json(expenses);
                });
            });
    expenseRouter.route('/:exp_id')
            .delete(function (req, res) {
                Expense.remove({
                    _id: req.params.exp_id,
                    owner: req.decoded.email
                }, function (err, user) {
                    if (err) res.json({success: false, message: err.code});
                    else res.json({success: true, message: 'Successfully deleted'});
                });
            });

    expenseRouter.route('/shares')
            .get(function (req, res) {
                Expense.find({'shares.user' : req.decoded.email}, function (err, expenses) {
                    if (err) res.json({success: false, message: err.code});
                    else res.json(expenses);
                });
            });
    expenseRouter.route('/accept')
            .post(function (req, res) {
                Expense.findOne({ _id: req.body.expid}, function (err, expense) {
                    if (err) res.json({success: false, message: err.code});
                    else if(expense){
                        acptd = true;
                        expense.shares.forEach(function(share){
                            if(share.user === req.decoded.email){
                                share.accepted = true;
                            }
                            if(!share.accepted){
                               acptd = false; 
                            }
                        });
                        expense.accepted = acptd;
                        expense.save(function (err) {
                            if (err) res.json({success: false, message: err.code});
                            else res.json({success: true, message: 'Expense accepted!'});
                        });
                    } else {
                        res.json({success: false, message: 'Could not update expense!'});
                    }
                });
            });

    return expenseRouter;
};