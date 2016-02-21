angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/expense/shares');
	};

	budgetFactory.addExpense = function(expid, date, tags, note, payed, shares) {
		postData = {expid: expid, date: date, tags: tags, note: note, amount: payed, shares: shares}
		return $http.post('/api/expense/', postData);
	};

	budgetFactory.deleteExpense = function(eId) {
		return $http.delete('/api/expense/'+eId);
	};

	return budgetFactory;
});