angular.module('sharedCtrl', [])

.controller('sharedController', function($scope, $uibModal, Budget, Auth) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"];
    
    var vm = this;

    vm.sharedwithlist = [];
    vm.sharedwith = "";

    $scope.toggle = function(userId) {
        vm.sharedwith = userId;
    };

    vm.month = 1+(new Date().getMonth());
    vm.year = (new Date().getFullYear());
    vm.lPeriod = false;

    vm.periodLabel = "";
    vm.periodString = "";

    Auth.getUser().then(function (data) {
        vm.mymail = data.data.email;
    });

    pad = function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    vm.perToggle = function () {
        vm.lPeriod = !vm.lPeriod;
        redrawPeriod();
    };

    vm.perPlus = function () {
        if(vm.lPeriod){
           vm.year++;
        } else {
            vm.month++;
            if(vm.month > 12){
                vm.year++;
                vm.month = 1;
            }
        }
        redrawPeriod();
    };

    vm.perMinus = function () {
        if(vm.lPeriod){
           vm.year--;
        } else {
            vm.month--;
            if(vm.month < 1){
                vm.year--;
                vm.month = 12;
            }
        }
        redrawPeriod();
    };

    redrawPeriod = function(){
        if(vm.lPeriod){
            vm.periodLabel = vm.year;
            vm.periodString = vm.year;
        } else {
            vm.periodLabel = monthNames[vm.month-1]+" "+vm.year;
            vm.periodString = vm.year+"-"+pad(vm.month,2);
        }
    }

    redraw = function () {
        Budget.all().success(function (data) {
            vm.expenses = data;

            sharedlst = new Set();
            vm.expenses.filter(function (expense) {
                if(expense.owner === vm.mymail){
                        expense.shares.filter(function (el) {
                            sharedlst.add(el.user);
                        });
                    } else {
                        sharedlst.add(expense.owner);
                    }
            });
            sharedlst.delete(vm.mymail);
            vm.sharedwithlist = [v for (v of sharedlst)];
            if(sharedlst.size > 0){
                vm.sharedwith = vm.sharedwithlist[0];
            }
            redrawPeriod();
        });
    }

    redraw();



})

