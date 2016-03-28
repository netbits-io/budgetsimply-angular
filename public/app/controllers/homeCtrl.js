angular.module('homeCtrl', [])

.controller('homeController', function($route, $scope, $uibModal, Budget, Auth, $filter, $timeout, User) {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var vm = this;

  vm.totalItems = 1;
  vm.currentPage = 1;

  redrawReqs = function(){
    User.friendRequests().success(function (data) {
      if(data.success){
        vm.frequests = data.requests;
      }
    });
  };
  redrawReqs();

  vm.acceptFriend = function (rId, rMail) {
    User.acceptFriend(rId, rMail).success(function (data) {
      if(data.success){
        $timeout(
          function(){
            redrawReqs();
            vm.infsuccess = data.message +" ::: "+new Date();
          }, 900);
      }else{
        vm.infdanger = data.message +" ::: "+new Date();
      }
    });
  };
  vm.rejectFriend = function (rId, rMail) {
    User.rejectFriend(rId, rMail).success(function (data) {
      if(data.success){
        $timeout(
          function(){
            redrawReqs();
            vm.infsuccess = data.message +" ::: "+new Date();
          }, 900);
      }else{
        vm.infdanger = data.message +" ::: "+new Date();
      }
    });
  };

  repage = function(){
    if(typeof vm.me !== 'undefined'){
      fltrd = $filter("onlymyrejected")(vm.expenses, vm.me.email);
      fltrd = $filter("periodfor")(fltrd, vm.periodString);
      fltrd = $filter("tagsfilter")(fltrd, vm.filterText, vm.me.email);
      vm.totalItems = fltrd.length;
    }
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
    entry.shares.filter(function(share){
      if(share.user === vm.me.email){
        result = share.tags;
      }
    });
    return result;
  }
  
  vm.haveIAccepted = function (entry) {
    var result = false;
    entry.shares.filter(function(share){
      if(share.user === vm.me.email){
        result = share.accepted;
      }
    });
    return result;
  };

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
    $timeout(function(){redraw();}, 900);   
  });
};
vm.acceptExpense = function (eId) {
  Budget.acceptExpense(eId).success(function (data) {
    if(data.success){
      $timeout(function(){redraw();}, 900);
      vm.infsuccess = data.message +" ::: "+new Date();
    }else{
      vm.infdanger = data.message +" ::: "+new Date();
    }
  });
};
vm.rejectExpense = function (eId) {
  Budget.rejectExpense(eId).success(function (data) {
    if(data.success){
      $timeout(function(){redraw();}, 900);
      vm.infsuccess = data.message +" ::: "+new Date();
    }else{
      vm.infdanger = data.message +" ::: "+new Date();
    }
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
vm.modalTags = function (existing) {
  var modalInstance = $uibModal.open({
    templateUrl: 'app/views/pages/private/edittagsm.html',
    controller: 'edtgsController',
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

