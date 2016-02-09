var bodyParser = require('body-parser'); 	// get body-parser
var Budget = require('../models/budget');
var config = require('../../config');

module.exports = function (app, express) {
    var budgetRouter = express.Router();

    budgetRouter.route('/')
            .post(function (req, res) {
                var budget = new Budget();		
                budget.name = req.body.name; 
  
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
                Budget.find({}, function (err, budgets) {
                    if (err)
                        res.send(err);
                    res.json(budgets);
                });
            });


    return budgetRouter;
};