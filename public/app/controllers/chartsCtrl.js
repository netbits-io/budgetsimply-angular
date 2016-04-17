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
        item.amount = parseFloat(amount);
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
        vm.tabs = [];
        vm.items.filter(function(item){
          item.active = true;
          vm.tabs.push(item.tab);
        });
        var uniqueNames = [];
        $.each(vm.tabs, function(i, el){
          if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        vm.tabs = uniqueNames;
        vm.activeTab = vm.tabs[0];
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

vm.setTab = function (tab) {
  vm.activeTab = tab;
  redrawPeriod();
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
  total = 0;
  vm.items.filter(function(item){
    if(item.active && item.tab == vm.activeTab){
      rows.push({c: [{v: ""+item.filter+" ("+item.amount+")"},{v: item.amount }]});
      total += parseFloat(item.amount);
      average = $filter("calcaverage")(item.amount, iperiod, idate);
      item.average = average;
    }
  });
  if(vm.radioMode === "c"){
    idate = vm.date;
    iperiod = vm.period;
    vm.average = $filter("calcaverage")(total, iperiod, idate);
  } else {
    vm.average = 'n/a';
  }
  vm.total = total.toFixed(2);

  $scope.chartObject.type = "PieChart";

  $scope.chartObject.data = {
      "cols": cols, 
      "rows": rows
  };
}

});

