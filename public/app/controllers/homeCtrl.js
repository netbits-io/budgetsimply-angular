angular.module('homeCtrl', [])

.controller('homeController', function($scope, $uibModal, Budget) {
   var vm = this;

  Budget.all().success(function (data) {
        vm.budgets = data;
        vm.budget =  vm.budgets[0];
        console.log(data);
    });

    $scope.toggle = function(id) {
        vm.budget = vm.budgets.filter(function (bgt) {
            return bgt._id === id;
        })[0];

        console.log('Dropdown is now: ', open);
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
                    }, 
                    function () {
                        console.log('Modal dismissed at: ' + new Date());
                    }
                );
            };

})

