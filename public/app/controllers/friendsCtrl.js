angular.module('friendsCtrl', [])

.controller('friendsController', function($scope, Budget, Auth, sharedProperties) {
    var vm = this;
    
    vm.props = sharedProperties;
    vm.mymail = sharedProperties.getUser().email;

})

