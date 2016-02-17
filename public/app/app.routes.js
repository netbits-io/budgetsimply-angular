angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
        .when('/reset/:resetToken', {
			templateUrl : 'app/views/pages/public/reset.html',
   			controller  : 'mainController',
    			controllerAs: 'main'
		})
		
        // loggedIn home
		.when('/home', {
			templateUrl: 'app/views/pages/private/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})
		.when('/shared', {
			templateUrl: 'app/views/pages/private/shared.html',
			controller: 'sharedController',
			controllerAs: 'shared'
		})
        // loggedIn home
		.when('/me', {
			templateUrl: 'app/views/pages/private/editme.html',
			controller:   'meController',
			controllerAs: 'main'
		})
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/admin/users/view.html',
			controller: 'userController',
			controllerAs: 'user'
		})
		// form to create a new user
		.when('/users/create', {
			templateUrl: 'app/views/pages/admin/users/create.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})
		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/admin/users/edit.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})		
                // route for the home page
		.otherwise( {
			templateUrl : 'app/views/pages/public/welcome.html'
		})
                ;
	$locationProvider.html5Mode(true);
});
