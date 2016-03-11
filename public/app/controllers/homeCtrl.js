angular.module('homeCtrl', [])

.controller('homeController', function($route, $scope, $uibModal, Budget, Auth, $filter) {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var vm = this;

  vm.totalItems = 1;
  vm.currentPage = 1;

  repage = function(){
    fltrd = $filter("periodfor")(vm.expenses, vm.periodString);
    fltrd = $filter("tagsfilter")(fltrd, vm.filterText, vm.me.email);
    vm.totalItems = fltrd.length;
  }

  $scope.$watch('home.filterText', function(nw, ol) {
        repage();
  });
  $scope.$watch('home.periodString', function(nw, ol) {
        repage();
  });

  vm.radioMode = 'my';

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

  redrawPeriod = function(){
    if(vm.lPeriod){
      vm.periodLabel = vm.year;
      vm.periodString = vm.year;
    } else {
      vm.periodLabel = monthNames[vm.month-1]+" "+vm.year;
      vm.periodString = vm.year+"-"+pad(vm.month,2);
    }
    repage();
  }

  redraw = function () {
    Budget.all().success(function (data) {
      vm.expenses = data;
      redrawPeriod();
    });
  }

  vm.myTags = function(entry){
    var result = [];
    //console.log(entry);
    entry.shares.filter(function(share){
      if(share.user === vm.me.email){
        console.log(share.tags);
        result = share.tags;
      }
    });
    return result;
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

 Auth.getUser().then(function (data) {
    vm.me = data.data;
    redraw();
  });

vm.deleteExpense = function (eId) {
  Budget.deleteExpense(eId).success(function (data) {
    redraw();
  });
};

vm.acceptExpense = function (eId) {
  Budget.acceptExpense(eId).success(function (data) {
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

