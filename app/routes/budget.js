var bodyParser = require('body-parser');
var Budget = require('../models/budget');
var config = require('../../config');

module.exports = function (app, express) {
    var budgetRouter = express.Router();

    budgetRouter.route('/')
            .post(function (req, res) {
                var budget = new Budget();		
                budget.name = req.body.name; 
                budget.owner = req.decoded.email;
                budget.shares.push(req.decoded.email);
  
                budget.save(function (err) {
                    if (err) {
                        if (err.code == 11000)
                            return res.json({success: false, message: 'A user with that email already exists. '});
                        else
                            return res.json({success: false, message: err.code});
                    }
                    res.json({success: true, message: 'Budget created!'});
                });

            })
            .get(function (req, res) {
                Budget.find({shares: req.decoded.email}, function (err, budgets) {
                    if (err)
                        res.send(err);
                    res.json(budgets);
                });
            });

    budgetRouter.route('/:budget_id/expense')
            .post(function(req,res){
                Budget.findOne( {'_id' : req.params.budget_id }, function(err, budget){
                    if(err) return res.json({success: false, err: err, message: 'Expense failed!'});
                    if(budget){
                        date = req.body.date;
                        tags = req.body.tags;
                        note = req.body.note;
                        payed = {payer: req.decoded.email, amount: req.body.payed};
                        budget.entries.push({date: date, tags: tags, note: note, payed: payed});
                        budget.save( function(err){
                            if(err) return res.json({success: false, err: err, message: 'Expense failed!'});
                            return res.json({success: true, message: 'Expense added!'});
                        });
                    }
                 });
            });

    budgetRouter.route('/:budget_id/share')
            .post(function(req,res){
                Budget.findOne( {'_id' : req.params.budget_id }, function(err, budget){
                    if(err) return res.json({success: false, err: err, message: 'Budget share failed!'});
                    if(budget){
                        user = req.body.userId;
                        budget.shares.push(user);
                        budget.save( function(err){
                            if(err) return res.json({success: false, err: err, message: 'Budget share failed!'});
                            return res.json({success: true, message: 'Budget shared!'});
                        });
                    }
                 });
            });

     budgetRouter.route('/:budget_id/expense/:expense_id')
            .delete(function(req,res){
                Budget.findOne( {'_id' : req.params.budget_id }, function(err, budget){
                    if(err) return res.json({success: false, err: err, message: 'Expense failed!'});
                    if(budget){
                        budget.entries = budget.entries.filter(function(el){ return el._id != req.params.expense_id ; });
                        budget.save( function(err){
                            if(err) return res.json({success: false, err: err, message: 'Expense failed!'});
                            return res.json({success: true, message: 'Expense added!'});
                        });
                    }
                 });
            });


    return budgetRouter;
};