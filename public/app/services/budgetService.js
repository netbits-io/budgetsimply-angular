angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/budgt/');
	};

	budgetFactory.create = function(name) {
		return $http.post('/api/budgt/', {name: name});
	};

	budgetFactory.addExpense = function(budgetId, date, tags, note, payed) {
		return $http.post('/api/budgt/'+budgetId+'/expense', {date: date, tags: tags, note: note, payed: payed});
	};

	return budgetFactory;
});