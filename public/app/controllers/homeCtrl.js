angular.module('homeCtrl', [])

.controller('homeController', function($scope, $uibModal, Budget) {
    var vm = this;
    vm.id = 0;

    redraw = function () {
        Budget.all().success(function (data) {
            vm.budgets = data;
            if(vm.id == 0 && vm.budgets[0]){
                vm.id = vm.budgets[0]._id;
            }
            $scope.toggle(vm.id);
        });
    }
    redraw();

    $scope.toggle = function(id) {
        vm.budget = vm.budgets.filter(function (bgt) {
            return bgt._id === id;
        })[0];
        vm.id = vm.budget._id;
    };


  vm.modalExpense = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/views/pages/private/newexpense.html',
                    controller: 'newexController',
                    controllerAs: 'main',
                    resolve: {
                        budget: function () {
                            console.log(vm.budget);
                            return vm.budget;
                        }
                    }
                });
                modalInstance.result.then(
                    function () {
                        console.log('Modal ok at: ' + new Date());
                        redraw();
                    }, 
                    function () {
                        console.log('Modal dismissed at: ' + new Date());
                    }
                );
            };

  vm.modalBudget = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/views/pages/private/newbudget.html',
                    controller: 'newbdgController',
                    controllerAs: 'main',
                    resolve: {
                    }
                });
                modalInstance.result.then(
                    function () {
                        console.log('Modal ok at: ' + new Date());
                        redraw();
                    }, 
                    function () {
                        console.log('Modal dismissed at: ' + new Date());
                    }
                );
            };

})

