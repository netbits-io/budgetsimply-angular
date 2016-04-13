var bodyParser = require('body-parser');
var Filter = require('../models/filter');
var config = require('../../config');

module.exports = function (app, express) {
    var filterRouter = express.Router();

    filterRouter.route('/')
            .post(function (req, res) {
                    var filter = new Filter();
                    filter.date = req.body.date;
                    filter.period = req.body.period;
                    filter.owner = req.decoded.email;
                    filter.filter = req.body.filter;
                    filter.save(function (err) {
                        if (err) res.json({success: false, message: 'Could not save filter!'});
                        else res.json({success: true, message: 'Filter saved!'});
                    });
            })
            .get(function (req, res) {
                Filter.find({owner: req.decoded.email}, function (err, filters) {
                    if (err) res.json({success: false, message: 'Could not get filters!'});
                    else res.json(filters);
                });
            });
    filterRouter.route('/:exp_id')
            .delete(function (req, res) {
                Filter.remove({
                    _id: req.params.exp_id,
                    owner: req.decoded.email
                }, function (err, user) {
                    if (err) res.json({success: false, message: 'Could not delete filter!'});
                    else res.json({success: true, message: 'Successfully deleted'});
                });
            });

    return filterRouter;
};