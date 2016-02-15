angular.module('shareBCtrl', ['budgetService'])

.controller('shareBController', function ($scope, Auth, $uibModalInstance, Budget, budget) {
    var vm = this;

    vm.ok = function () {
    	Budget.share(budget._id, vm.userId).success(function (data) {
            $uibModalInstance.close('ok');
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});