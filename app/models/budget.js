var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BudgetSchema   = new Schema({
	name: String,
	owner: String,
	shares: [ String],
	entries {
		date: date,
		tags: [{ text: String}],
		note: String,
		payed: [{ payer: String, amount: Number}],
	}
	
});

module.exports = mongoose.model('Budget', BudgetSchema);
