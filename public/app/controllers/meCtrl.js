angular.module('meCtrl', [])

.controller('meController', function (Auth, $uibModalInstance) {
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.user = data.data;
        vm.meData = vm.user;
    })

    vm.ok = function (isValid) {
        console.log(vm.meData);
        $uibModalInstance.close('ok');
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});