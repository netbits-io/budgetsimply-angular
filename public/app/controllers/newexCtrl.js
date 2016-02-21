angular.module('newexCtrl', ['budgetService'])

.controller('newexController', function ($scope, Auth, $uibModalInstance, Budget, Auth, existing) {
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
        if(existing != null){
            vm.tags = existing.tags;
            vm.note = existing.note;
            vm.payed = existing.amount;
            vm.tags = existing.tags;
            vm.shares = existing.shares.filter(function(item) {
                return vm.me.email != item.user;
            });
            vm.id = existing._id;
            vm.dt = existing.date;
        } else {
            vm.id = null;
            vm.tags = [];
            vm.shares = [];
            vm.dt = new Date();
        }
    });

    vm.ok = function () {
        forme = vm.payed;
        vm.shares.filter(function(el){
            forme = forme - el.amount;
        });
        vm.shares.push({user: vm.me.email, accepted: true, amount: forme});
        Budget.addExpense(vm.id, vm.dt, vm.tags, vm.note, vm.payed, vm.shares).success(function (data) {
            $uibModalInstance.close('ok');
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.sharePlus = function () {
        vm.shares.push({user: '', accepted: false});
    };

    vm.openDt = function() {
        vm.popup.opened = true;
    };

    vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    vm.format = 'dd.MM.yyyy';
    vm.popup = {
        opened: false
    };
    
    vm.allTags = [];
    vm.loadTags = function($query) {
        return vm.allTags.filter(function(item) {
            return item.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

});