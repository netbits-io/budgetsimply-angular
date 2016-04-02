angular.module('friendsCtrl', [])

.controller('friendsController', function($scope, $uibModal, Budget, Auth) {
    var vm = this;
    vm.loggedin = false
    vm.usermail = '';
    vm.useradmin = false;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
        vm.loggedin = true;
        vm.usermail = data.data.email;
        vm.useradmin = data.data.admin;
    });

    vm.modalFriend = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/views/pages/private/newfriendm.html',
      controller: 'newfrndController',
      controllerAs: 'modal',
      resolve: {}
    });
    modalInstance.result.then(
      function (message) {
        vm.infsuccess = message + " ::: "+new Date();
      }, 
      function () {
      }
    )
  };

})

