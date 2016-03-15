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
	accepted: Boolean,
    rejected: Boolean,
	shares: [{
		user: String, 
		accepted: Boolean,
    	rejected: Boolean, 
		amount: Number, 
		payback: Boolean,
		loan: Boolean,
		tags: [{ 
			text: String,
		}]
	}]
});

module.exports = mongoose.model('Expense', ExpenseSchema);
