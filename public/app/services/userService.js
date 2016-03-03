angular.module('userService', [])

.factory('User', function($http) {
	// create a new object
	var userFactory = {};
	// get a single user
	userFactory.get = function(id) {
		return $http.get('/api/admin/users/' + id);
	};
	// get all users
	userFactory.all = function() {
		return $http.get('/api/admin/users/');
	};
	// create a user
	userFactory.create = function(userData) {
		return $http.post('/api/admin/users/', userData);
	};
	// update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/admin/users/' + id, userData);
	};
	// delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/admin/users/' + id);
	};

	userFactory.addFriend = function (friendMail) {
        return $http.post('/api/user/friend',{email: friendMail});
    };
	// return our entire userFactory object
	return userFactory;

});