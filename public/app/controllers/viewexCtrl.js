angular.module('viewexCtrl', ['budgetService'])

.controller('viewexController', function ($scope, $uibModalInstance, Budget, Auth, existing) {
   
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
        vm.mymail = data.data.email;
        vm.expense = existing;
        existing.shares.filter(function(item) {
                if(item.payback){
                    vm.payback = true;
                }
                if(item.loan){
                    vm.loan = true;
                }
                if(vm.me.email == item.user){
                    vm.tags = item.tags;
                }
            });
    });

    vm.ok = function () {
        $uibModalInstance.close('ok');
    };

});