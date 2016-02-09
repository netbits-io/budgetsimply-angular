angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/budgt/');
	};

	budgetFactory.create = function(name) {
		return $http.post('/api/budgt/', {name: name});
	};

	return budgetFactory;
});