angular.module('edtgsCtrl', ['budgetService'])

.controller('edtgsController', function ($scope, $uibModalInstance, Budget, Auth, existing) {
    var vm = this;

    vm.extended = false;
    vm.payback = false;
    vm.loan = false;

    vm.sharedwithlist = [];
    vm.allTags = [];

    redraw = function () {
        Budget.all().success(function (data) {
            allTgs = new Set();
            data.filter(function (expense) {
                expense.shares.filter(function (share) {
                    share.tags.filter(function (tag) {
                        allTgs.add(tag.text);
                    });
                });
            });
            if(allTgs.size > 0){
                tagsArray=Array.from(allTgs);
                tagsArray.filter(function (el) {
                    vm.allTags.push({text: el});
                });
            }
        });
    }

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
        redraw();
    });

    vm.loadTags = function($query) {
        return vm.allTags.filter(function(item) {
            return item.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

    vm.ok = function () {
        Budget.editTags(vm.expense._id, vm.tags).success(function (data) {
            if(data.success){
                $uibModalInstance.close('ok');
            }else{
                vm.danger=data.message + " ::: " + new Date();
            }
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});