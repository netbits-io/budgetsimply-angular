var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FilterSchema = new Schema({
    date: Date,
    period: String,
    owner: String,
    tab: String,
    filter: String
});

module.exports = mongoose.model('Filter', FilterSchema);
