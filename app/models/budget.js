var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BudgetSchema   = new Schema({
	name: String,
	owners {
		email: String,
	},
	entries {
		note: String,
		category: String,
		date: date,
		payed: {
			payer:  String,
			amoint:  double
		}
	}
	
});


BudgetSchema.methods.addEntry = function(owner, note, category, date, amount) {

};

module.exports = mongoose.model('Budget', BudgetSchema);