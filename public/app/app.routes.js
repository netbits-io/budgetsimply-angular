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
		.when('/friends', {
			templateUrl: 'app/views/pages/private/friends.html',
			controller: 'friendsController',
			controllerAs: 'friends'
		})
		.when('/charts', {
			templateUrl: 'app/views/pages/private/charts.html',
			controller: 'chartsController',
			controllerAs: 'charts'
		})
		// .when('/me', {
		// 	templateUrl: 'app/views/pages/private/editme.html',
		// 	controller:   'meController',
		// 	controllerAs: 'main'
		// })
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
		.when('/tos', {
			templateUrl: 'app/views/pages/public/tos.html',
			controller: 'mainController',
			controllerAs: 'main'
		})		
		.when('/about', {
			templateUrl: 'app/views/pages/public/about.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
		.when('/policy', {
			templateUrl: 'app/views/pages/public/policy.html',
			controller: 'mainController',
			controllerAs: 'main'
		})
        // route for the welcome page
		.otherwise( {
			templateUrl : 'app/views/pages/public/welcome.html'
		})
                ;
	$locationProvider.html5Mode(true);
});
