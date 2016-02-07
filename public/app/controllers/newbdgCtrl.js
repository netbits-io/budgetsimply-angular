angular.module('newbdgCtrl', [])

.controller('newbdgController', function ($scope, Auth, $uibModalInstance) {
    var vm = this;

    vm.ok = function () {
        $uibModalInstance.close('ok');
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});