var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ExpenseSchema = new Schema({
	date: Date,
	tags: [{ 
		text: String,
	}],
	note: String,
	owner: String,
	amount: Number,
	shares: [{
		user: String, 
		accepted: Boolean, 
		amount: Number, 
		payback: Boolean,
		tags: [{ 
			text: String,
		}]
	}]
});

module.exports = mongoose.model('Expense', ExpenseSchema);
