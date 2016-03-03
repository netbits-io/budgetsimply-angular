angular.module('newexCtrl', ['budgetService'])

.controller('newexController', function ($scope, Auth, $uibModalInstance, Budget, Auth, existing, sharedProperties) {
    var vm = this;

    vm.props = sharedProperties;
    vm.mymail = sharedProperties.getUser().email;

    vm.me = sharedProperties.getUser();
    vm.mymail = sharedProperties.getUser().email;
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


    vm.sharedwithlist = [];
    vm.allTags = [];

    redraw = function () {
        Budget.all().success(function (data) {
            sharedlst = new Set();
            allTgs = new Set();
            data.filter(function (expense) {
                if(expense.owner === vm.mymail){
                    expense.shares.filter(function (el) {
                        sharedlst.add(el.user);
                    });
                    expense.tags.filter(function (el) {
                        allTgs.add(el.text);
                    });
                } else {
                    sharedlst.add(expense.owner);
                }
            });
            sharedlst.delete(vm.mymail);
            if(sharedlst.size > 0){
                vm.sharedwithlist = Array.from(sharedlst);
            }
            if(allTgs.size > 0){
                tagsArray=Array.from(allTgs);
                tagsArray.filter(function (el) {
                    vm.allTags.push({text: el});
                });
            }
        });
    }

    redraw();

    vm.cancelDanger = function () {
        vm.danger="";
    };

    vm.ok = function () {
        forme = vm.payed;
        vm.shares.filter(function(el){
            forme = forme - el.amount;
        });
        sharesCopy = JSON.parse(JSON.stringify(vm.shares));
        sharesCopy.push({user: vm.me.email, accepted: true, amount: forme});
        Budget.addExpense(vm.id, vm.dt, vm.tags, vm.note, vm.payed, sharesCopy).success(function (data) {
            if(data.success){
                $uibModalInstance.close('ok');
            }else{
                vm.danger=data.message;
            }
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.sharePlus = function () {

        vm.shares.push({user: '', accepted: false, amount: vm.payed/2});
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

    vm.loadTags = function($query) {
        return vm.allTags.filter(function(item) {
            return item.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

});