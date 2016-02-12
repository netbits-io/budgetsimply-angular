angular.module('newbdgCtrl', [])

.controller('newbdgController', function ($scope, Auth, $uibModalInstance, Budget) {
    var vm = this;

    vm.ok = function () {
    	Budget.create(vm.name).success(function (data) {
            $uibModalInstance.close('ok');
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});