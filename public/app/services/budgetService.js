angular.module('budgetService', [])

.factory('Budget', function($http) {

	var budgetFactory = {};

	budgetFactory.all = function() {
		return $http.get('/api/budgt/');
	};

	userFactory.create = function(budgetData) {
		return $http.post('/api/budgt/', budgetData);
	};

	return budgetFactory;
});