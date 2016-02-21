angular.module('homeCtrl', [])

.controller('homeController', function($scope, $uibModal, Budget, Auth) {

  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  var vm = this;

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
    redrawPeriod();
  });
}

redraw();

vm.deleteExpense = function (eId) {
  Budget.deleteExpense(eId).success(function (data) {
    redraw();
  });
};


vm.modalExpense = function (existing) {
  var modalInstance = $uibModal.open({
    templateUrl: 'app/views/pages/private/newexpense.html',
    controller: 'newexController',
    controllerAs: 'main',
    resolve: {
      existing: function () {
        return existing;
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

})

