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
                    expense.tags = req.body.tags;
                    expense.note = req.body.note;
                    expense.owner = req.decoded.email;
                    expense.amount = req.body.amount;
                    expense.shares = req.body.shares;
                    expense.save(function (err) {
                        if (err) res.json({success: false, message: err.code});
                        res.json({success: true, message: 'Expense saved!'});
                    });
                } else {
                    Expense.findOne({owner: req.decoded.email, _id: req.body.expid}, function (err, expense) {
                    if (err) res.json({success: false, message: err.code});
                    if(expense){
                        expense.date = req.body.date;
                        expense.tags = req.body.tags;
                        expense.note = req.body.note;
                        expense.amount = req.body.amount;
                        expense.shares = req.body.shares;
                        expense.save(function (err) {
                            if (err) res.json({success: false, message: err.code});
                            res.json({success: true, message: 'Expense saved!'});
                        });
                    } else {
                        res.json({success: false, message: 'Could not update expense!'});
                    }
                });

                }

            })
            .get(function (req, res) {
                Expense.find({owner: req.decoded.email}, function (err, expenses) {
                    if (err) res.json({success: false, message: err.code});
                    res.json(expenses);
                });
            });
    expenseRouter.route('/:exp_id')
            .delete(function (req, res) {
                Expense.remove({
                    _id: req.params.exp_id,
                    owner: req.decoded.email
                }, function (err, user) {
                    if (err) res.json({success: false, message: err.code});
                    res.json({success: true, message: 'Successfully deleted'});
                });
            });

    expenseRouter.route('/shares')
            .get(function (req, res) {
                Expense.find({'shares.user' : req.decoded.email}, function (err, expenses) {
                    if (err) res.json({success: false, message: err.code});
                    res.json(expenses);
                });
            });

    return expenseRouter;
};