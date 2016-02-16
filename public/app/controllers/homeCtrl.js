angular.module('homeCtrl', [])

.controller('homeController', function($scope, $uibModal, Budget) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"];
    
    var vm = this;

    vm.month = 1+(new Date().getMonth());
    vm.year = (new Date().getFullYear());
    vm.lPeriod = false;

    vm.periodLabel = "";
    vm.periodString = "";

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
            redrawPeriod();
        });
    }

    redraw();

    // $scope.toggle = function(id) {
    //     vm.budget = vm.budgets.filter(function (bgt) {
    //         return bgt._id === id;
    //     })[0];
    //     vm.id = vm.budget._id;
    // };

    vm.deleteExpense = function (eId) {
         Budget.deleteExpense(vm.budget._id, eId).success(function (data) {
            redraw();
        });
    };


  vm.modalExpense = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/views/pages/private/newexpense.html',
                    controller: 'newexController',
                    controllerAs: 'main',
                    resolve: {
                        budget: function () {
                            return vm.budget;
                        }
                    }
                });
                modalInstance.result.then(
                    function () {
                        redraw();
                    }, 
                    function () {
                    }
                );
            };

  // vm.modalBudget = function () {
  //               var modalInstance = $uibModal.open({
  //                   templateUrl: 'app/views/pages/private/newbudget.html',
  //                   controller: 'newbdgController',
  //                   controllerAs: 'main',
  //                   resolve: {
  //                   }
  //               });
  //               modalInstance.result.then(
  //                   function () {
  //                       redraw();
  //                   }, 
  //                   function () {
  //                   }
  //               );
  //           };

   // vm.modalShareBudget = function () {
   //              var modalInstance = $uibModal.open({
   //                  templateUrl: 'app/views/pages/private/sharebudget.html',
   //                  controller: 'shareBController',
   //                  controllerAs: 'main',
   //                  resolve: {
   //                      budget: function () {
   //                          return vm.budget;
   //                      }
   //                  }
   //              });
   //              modalInstance.result.then(
   //                  function () {
   //                      redraw();
   //                  }, 
   //                  function () {
   //                  }
   //              );
   //          };

})

