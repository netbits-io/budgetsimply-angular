angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/expense/shares');
	};

	budgetFactory.addExpense = function(expid, date, tags, note, payed, shares, payback, loan) {
		postData = {expid: expid, date: date, tags: tags,note: note, amount: payed, shares: shares, payback: payback, loan: loan}
		return $http.post('/api/expense/', postData);
	};
	budgetFactory.editTags = function(expid, tags) {
		postData = {expid: expid, tags: tags}
		return $http.post('/api/expense/tags', postData);
	};
	budgetFactory.acceptExpense = function(expid) {
		return $http.post('/api/expense/accept', {expid: expid});
	};
	budgetFactory.rejectExpense = function(expid) {
		return $http.post('/api/expense/reject', {expid: expid});
	};
	budgetFactory.deleteExpense = function(eId) {
		return $http.delete('/api/expense/'+eId);
	};

	return budgetFactory;
});