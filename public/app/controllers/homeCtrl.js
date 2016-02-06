angular.module('homeCtrl', [])

.controller('homeController', function($scope, $uibModal) {
	var vm = this;

  vm.modalExpense = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/views/pages/private/newexpense.html',
                    controller: 'newexController',
                    controllerAs: 'main',
                    resolve: {}
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

  $scope.budgets = [
    'budget1',
    'budget2',
    'budget3',
    ];
  $scope.budget = $scope.budgets[0];

  $scope.toggle = function(open) {
        $scope.budget = $scope.budgets[open];
        console.log('Dropdown is now: ', open);
    };


  
})

