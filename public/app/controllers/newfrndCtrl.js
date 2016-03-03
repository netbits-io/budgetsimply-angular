angular.module('newfrndCtrl', [])

.controller('newfrndController', function ($scope, $uibModalInstance, User) {
    var vm = this;

    vm.ok = function () {
        friendMail = vm.email;
        User.addFriend(friendMail).success(function (data) {
            if(data.success){
                $uibModalInstance.close(data.message);
            }else{
                vm.infdanger=data.message + " ::: "+new Date();
            }
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});