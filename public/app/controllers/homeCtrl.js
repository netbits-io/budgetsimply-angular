angular.module('homeCtrl', [])

.controller('homeController', function($route, $scope, $uibModal, Budget, Auth, $filter, $timeout, User, Filter) {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var vm = this;
  vm.loggedin = false
  vm.usermail = '';
  vm.useradmin = false;

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
          }, 700);
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
          }, 700);
      }else{
        vm.infdanger = data.message +" ::: "+new Date();
      }
    });
  };

  repage = function(){
    if(typeof vm.me !== 'undefined'){
      fltrd = $filter("onlymyrejected")(vm.expenses, vm.me.email);
      fltrd = $filter("periodfor")(fltrd, vm.period, vm.date);
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

  vm.date = new Date();
  vm.period = "m";
  vm.periodLabel = "";

  pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  redrawPeriod = function(){
    if(vm.period === "y"){
      vm.periodLabel = vm.date.getFullYear();
    } else {
      vm.periodLabel = monthNames[vm.date.getMonth()]+" "+vm.date.getFullYear();
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
    if(vm.period === "y"){
      vm.period = "m";
    } else {
      vm.period = "y";
    }
    redrawPeriod();
  };

vm.perPlus = function () {
    if(vm.period === "y"){
      vm.date.setYear(vm.date.getFullYear() + 1);
    }else{
      vm.date.setMonth(vm.date.getMonth() + 1);     
    }
    redrawPeriod();
};

vm.perMinus = function () {
  if(vm.period === "y"){
      vm.date.setYear(vm.date.getFullYear() - 1);
    }else{
      vm.date.setMonth(vm.date.getMonth() - 1);     
    }
  redrawPeriod();
};

Auth.getUser().then(function (data) {
  vm.me = data.data;
  vm.loggedin = true;
  vm.usermail = vm.me.email;
  vm.useradmin = vm.me.admin;
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
      //vm.infsuccess = data.message +" ::: "+new Date();
    }else{
      vm.infdanger = data.message +" ::: "+new Date();
    }
  });
};
vm.rejectExpense = function (eId) {
  Budget.rejectExpense(eId).success(function (data) {
    if(data.success){
      $timeout(function(){redraw();}, 900);
      //vm.infsuccess = data.message +" ::: "+new Date();
    }else{
      vm.infdanger = data.message +" ::: "+new Date();
    }
  });
};

vm.addFilter = function () {
  if(vm.filterText && vm.filterText.length > 0){
    Filter.addFilter(vm.period, vm.date, "default", vm.filterText).success(function (data) {
      if(data.success){
        vm.infsuccess = data.message +" ::: "+new Date();
    } else{
        vm.infdanger = data.message +" ::: "+new Date();
      }  
    });
  }else{
    vm.infdanger = "You must enter a filter before adding it to the charts! ::: "+new Date();
  }
};

vm.modalFilters = function () {
  var modalInstance = $uibModal.open({
    templateUrl: 'app/views/pages/private/addfilter.html',
    controller: ['$scope', '$modalInstance', 'Filter', function ($scope, $uibModalInstance, Filter){
                              var mm = this;

                              Filter.all().success(function (data) {
                                mm.items = data;
                                mm.tabs = [];
                                mm.items.filter(function(item){
                                  item.active = true;
                                  mm.tabs.push(item.tab);
                                });
                                var uniqueNames = [];
                                $.each(mm.tabs, function(i, el){
                                  if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                                });
                                mm.tabs = uniqueNames;
                              });

                              mm.ok = function () {
                                  if(vm.filterText && vm.filterText.length > 0){
                                     Filter.addFilter(vm.period, vm.date, mm.tab, vm.filterText).success(function (data) {
                                      if(data.success){
                                         vm.infsuccess = data.message +" ::: "+new Date();
                                      } else{
                                        vm.infdanger = data.message +" ::: "+new Date();
                                      }  
                                    });
                                  }else{
                                    vm.infdanger = "You must enter a filter before adding it to the charts! ::: "+new Date();
                                  }
                                  $uibModalInstance.close('ok');
                              };

                              mm.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                              };
                            }
               ],
    controllerAs: 'main',
    resolve: {}
  });
  modalInstance.result.then(
    function () {

    }, 
    function () {
    }
    )
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

