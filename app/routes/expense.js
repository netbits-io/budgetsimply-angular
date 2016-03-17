var bodyParser = require('body-parser');
var Expense = require('../models/expense');
var config = require('../../config');

module.exports = function (app, express) {
    var expenseRouter = express.Router();

    expenseRouter.route('/')
            .post(function (req, res) {
                error = false;
                special = req.body.payback || req.body.loan;
                if(req.body.expid == null){
                    var expense = new Expense();
                    expense.date = req.body.date;
                    expense.note = req.body.note;
                    expense.owner = req.decoded.email;
                    expense.amount = req.body.amount;
                    expense.shares = req.body.shares;
                    for(var i = expense.shares.length - 1; i >= 0; i--) {
                        if(expense.shares[i].user === req.decoded.email) {
                            expense.shares.splice(i, 1);
                        } 
                    }
                    for(var i = expense.shares.length - 1; i >= 0; i--) {
                        expense.shares[i].payback = req.body.payback;
                        expense.shares[i].loan = req.body.loan;
                    }
                    forme = req.body.amount;
                    req.body.shares.filter(function(el){
                        forme = forme - el.amount;
                    });
                    expense.shares.push({user: req.decoded.email, accepted: true, amount: forme, payback: false, loan: false});
                    expense.shares.filter(function(el){
                        el.tags = req.body.tags;
                    });
                    expense.accepted = (expense.shares.length == 1);
                    expense.shares.forEach(function(share){
                        share.accepted = (share.user === req.decoded.email);
                    });
                    if(isNaN(req.body.amount) || expense.amount < 0 || forme < 0){
                        res.json({success: false, message: 'Invalid Expense amount(s)!'});
                    } else if(special && expense.shares.length != 2){
                            res.json({success: false, message: 'Payback or Loan expenses need be shared with exactly one Friend!'});
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
                            error = false;
                            special = false;
                            newShares = req.body.shares;
                            // keep the old tags
                            for(var i = newShares - 1; i >= 0; i--) {
                                for(var p = expense.shares - 1; p >= 0; p--) {
                                    if(newShares[i].user === expense.shares[p].user ) {
                                        newShares[i].tags = expense.shares[p].tags; 
                                    }
                                }
                            }
                            expense.shares = newShares;
                            for(var i = expense.shares.length - 1; i >= 0; i--) {
                                if(expense.shares[i].user === req.decoded.email) {
                                    expense.shares.splice(i, 1);
                                } 
                            }
                            for(var i = expense.shares.length - 1; i >= 0; i--) {
                                expense.shares[i].payback = req.body.payback;
                                expense.shares[i].loan = req.body.loan;
                            }
                            forme = req.body.amount;
                            req.body.shares.filter(function(el){
                                forme = forme - el.amount;
                            });
                            expense.shares.push({user: req.decoded.email, accepted: true, amount: forme, payback: false, loan: false, tags: req.body.tags});
                            expense.accepted = (expense.shares.length == 1);
                            expense.shares.forEach(function(share){
                                share.accepted = (share.user === req.decoded.email);
                            });
                            if(isNaN(req.body.amount) || expense.amount < 0 || forme < 0 || error){
                                res.json({success: false, message: 'Invalid Expense amount(s)!'});
                            } else if(special && expense.shares.length != 2){
                                res.json({success: false, message: 'Payback or Loan expenses need be shared with exactly one Friend!'});
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
                    if (err) res.json({success: false, message: 'Could not update expense!'});
                    else if(expense){
                        if(expense.accepted != true && expense.rejected != true && expense.shares.length > 1){
                            acptd = true;
                            iAccepted = false;
                            expense.shares.forEach(function(share){
                                if(share.user === req.decoded.email){
                                    share.accepted = true;
                                    iAccepted = true;
                                }
                                if(!share.accepted){
                                    acptd = false; 
                                }
                            });
                            if(iAccepted){
                                expense.accepted = acptd;
                                expense.save(function (err) {
                                    if (err) res.json({success: false, message: err.code});
                                    else res.json({success: true, message: 'Expense accepted!'});
                                });
                            } else {
                                //expense is shared and not accepted byt not with the current user
                                res.json({success: false, message: 'Could not update expense!'});
                            }
                        } else {
                            res.json({success: false, message: 'Expense is already accepted, rejected or not shared!'});
                        }
                    } else {
                        res.json({success: false, message: 'Could not update expense!'});
                    }
                });
            });
    expenseRouter.route('/reject')
            .post(function (req, res) {
                Expense.findOne({ _id: req.body.expid}, function (err, expense) {
                    if (err) res.json({success: false, message: 'Could not update expense!'});
                    else if(expense){
                        if(expense.accepted != true && expense.rejected != true && expense.shares.length > 1){
                            expense.shares.forEach(function(share){
                                if(share.user === req.decoded.email && share.accepted === false){
                                    share.rejected = true;
                                    expense.rejected = true;
                                }
                            });
                            if(expense.rejected){
                                expense.save(function (err) {
                                    if (err) res.json({success: false, message: err.code});
                                    else res.json({success: true, message: 'Expense rejected!'});
                                });
                            } else {
                                //expense is shared and not accepted byt not with the current user
                                res.json({success: false, message: 'Could not update expense!'});
                            }
                        } else {
                            res.json({success: false, message: 'Expense is already accepted, rejected or not shared!'});
                        }
                    } else {
                        res.json({success: false, message: 'Could not update expense!'});
                    }
                });
            });

    return expenseRouter;
};