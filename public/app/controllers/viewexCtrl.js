angular.module('viewexCtrl', ['budgetService'])

.controller('viewexController', function ($scope, Auth, $uibModalInstance, Budget, Auth, existing) {
   
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
        vm.mymail = data.data.email;
        vm.expense = existing;
    });

    vm.ok = function () {
        $uibModalInstance.close('ok');
    };

});