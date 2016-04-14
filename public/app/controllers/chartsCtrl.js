angular.module('chartsCtrl', [])

.controller('chartsController', function($route, $scope, $uibModal, Budget, Auth, $filter, $timeout, User, Filter) {

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var vm = this;
  vm.loggedin = false
  vm.usermail = '';
  vm.useradmin = false;

  $scope.chartObject = {};

  vm.radioMode = "c";
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

    if(typeof vm.me !== 'undefined'){

      vm.items.filter(function(item){
        idate = new Date(item.date);
        iperiod = item.period;
        if(vm.radioMode === "c"){
          idate = vm.date;
          iperiod = vm.period;
        }
        fltrd = $filter("onlyaccepted")(vm.expenses);
        fltrd = $filter("periodfor")(fltrd, iperiod, idate);
        fltrd = $filter("tagsfilter")(fltrd, item.filter, vm.me.email);
        amount = $filter("calctotalfor")(fltrd, vm.me.email);
        item.amount = parseInt(amount);
        if(iperiod === "y"){
          item.periodLabel = idate.getFullYear();
        } else {
          item.periodLabel = monthNames[idate.getMonth()]+" "+idate.getFullYear();
        }
      });

      vm.piechart();
    }
  }

  redraw = function () {
    Budget.all().success(function (data) {
      vm.expenses = data;
      Filter.all().success(function (data) {
        vm.items = data;
        redrawPeriod();
      });
    });
  }

  vm.redrawPeriod = function(){
    redrawPeriod();
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

vm.deleteFilter = function (eId) {
  Filter.deleteFilter(eId).success(function (data) {
    $timeout(function(){redraw();}, 600);   
  });
};

Auth.getUser().then(function (data) {
  vm.me = data.data;
  vm.loggedin = true;
  vm.usermail = vm.me.email;
  vm.useradmin = vm.me.admin;
  redraw();
});

vm.piechart = function(){
  $scope.chartObject.data = {};

  cols = [  {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}  ];

  rows = [];
  vm.items.filter(function(item){
      rows.push({c: [{v: ""+item.filter+" ("+item.amount+")"},{v: item.amount }]});
  });

  $scope.chartObject.type = "PieChart";

  $scope.chartObject.data = {
      "cols": cols, 
      "rows": rows};
}

})

