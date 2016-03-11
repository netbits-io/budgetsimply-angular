angular.module('newexCtrl', ['budgetService'])

.controller('newexController', function ($scope, $uibModalInstance, Budget, Auth, existing) {
    var vm = this;

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
        sharedlst = new Set();
        vm.me.friends.filter(function (frnd) {
            sharedlst.add(frnd.email);
        });
        if(sharedlst.size > 0){
            vm.sharedwithlist = Array.from(sharedlst);
        }
        redraw();
    });

    vm.ok = function () {
        forme = vm.payed;
        vm.shares.filter(function(el){
            forme = forme - el.amount;
        });
        sharesCopy = JSON.parse(JSON.stringify(vm.shares));

        sharesCopy.push({user: vm.me.email, accepted: true, amount: forme, payback: false});

        sharesCopy.filter(function(el){
            el.tags = vm.tags;
        });

        Budget.addExpense(vm.id, vm.dt, vm.tags, vm.note, vm.payed, sharesCopy).success(function (data) {
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

    vm.sharePlus = function () {
        vm.shares.push({user: '', accepted: false, amount: vm.payed/2, payback: false});
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