angular.module('sharedCtrl', [])

.controller('sharedController', function($route, $scope, $uibModal, Budget, Auth, $filter) {
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

  input = $filter("periodfor")(vm.expenses, vm.periodString);
  input = $filter("onlyshared")(input, vm.me.email, vm.sharedwith);
  vm.friendTotal = $filter("calctotalforshared")(input, vm.me.email, vm.sharedwith);

  input = $filter("periodfor")(vm.expenses, vm.periodString);
  input = $filter("onlyshared")(input, vm.sharedwith, vm.me.email);
  vm.userTotal = $filter("calctotalforshared")(input, vm.sharedwith, vm.me.email);
 

  vm.totalDiffFne = vm.friendTotal - vm.userTotal;
  vm.totalDiffUsr = vm.userTotal - vm.friendTotal;

  vm.totalDiffFne = vm.totalDiffFne.toFixed(2);
  vm.totalDiffUsr = vm.totalDiffUsr.toFixed(2);

}

redraw = function () {
    Budget.all().success(function (data) {
        vm.expenses = data;

        sharedlst = new Set();
        vm.expenses.filter(function (expense) {
            if(expense.owner === vm.me.email){
                expense.shares.filter(function (el) {
                    sharedlst.add(el.user);
                });
            } else {
                sharedlst.add(expense.owner);
            }
        });
        sharedlst.delete(vm.me.email);
        if(sharedlst.size > 0){
            vm.sharedwithlist = Array.from(sharedlst);
            vm.sharedwith = vm.sharedwithlist[0];
        }
        redrawPeriod();
    });
}

 Auth.getUser().then(function (data) {
    vm.me = data.data;
    redraw();
});

vm.payback = function(){
    usr = vm.me.email;
    fnd = vm.sharedwith;
    dat = new Date();
    tgs = [];
    tgs.push({text: 'payback'});
    nte = ""
    shrs = [];
    amnt = vm.totalDiffUsr;
    shrs.push({user: fnd, accepted: false, amount: amnt, payback: false});
    shrs.push({user: usr, accepted: true, amount: 0, payback: false});
    console.log(shrs);
    Budget.addExpense(undefined, dat, tgs, nte, amnt, shrs).success(function (data) {
        if(data.success){
            redraw();
            vm.infsuccess = "Payback expense added! ::: "+new Date();
        }else{
            vm.infdanger = data.message +" ::: "+new Date();
        }
    });
}

 vm.deleteExpense = function (eId) {
  Budget.deleteExpense(eId).success(function (data) {
    redraw();
  });
};

vm.modalExpense = function (existing) {
  var modalInstance = $uibModal.open({
    templateUrl: 'app/views/pages/private/newexpensem.html',
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
      $route.reload();
    }, 
    function () {
    }
  )
};

  vm.modalViewExpense = function (existing) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/views/pages/private/viewexpensem.html',
      controller: 'viewexController',
      controllerAs: 'main',
      resolve: {
        existing: function () {
          return existing;
        }
      }
    });
    modalInstance.result.then(
      function () {
      }, 
      function () {
      }
    )
  };

})

