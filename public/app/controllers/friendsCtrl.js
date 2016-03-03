angular.module('friendsCtrl', [])

.controller('friendsController', function($scope, $uibModal, Budget, Auth, sharedProperties) {
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
    });

    vm.modalFriend = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/views/pages/private/newFriend.html',
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

