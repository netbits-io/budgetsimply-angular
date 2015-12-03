var bodyParser = require('body-parser'); 	// get body-parser
var Budget = require('../models/budget');
var config = require('../../config');

module.exports = function (app, express) {
    var budgetRouter = express.Router();
    
    budgetRouter.get('/', function (req, res) {
        res.json();
    });
    
    return budgetRouter;
};