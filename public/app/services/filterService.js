angular.module('filterService', [])

.factory('Filter', function($http) {
    var filterFactory = {};
    filterFactory.all = function() {
        return $http.get('/api/filter');
    };
    filterFactory.addFilter= function(period, date, tab, filter) {
        postData = {period: period, date: date, tab: tab, filter: filter}
        return $http.post('/api/filter/', postData);
    };
    filterFactory.deleteFilter = function(eId) {
        return $http.delete('/api/filter/'+eId);
    };
    return filterFactory;
});