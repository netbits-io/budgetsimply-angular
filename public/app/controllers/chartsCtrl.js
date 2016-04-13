angular.module('chartsCtrl', [])

.controller('chartsController', function($route, $scope, $uibModal, Budget, Auth, $filter, $timeout, User, Filter) {

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var vm = this;
  vm.loggedin = false
  vm.usermail = '';
  vm.useradmin = false;

  $scope.chartObject = {};

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
  }

  redraw = function () {
    Budget.all().success(function (data) {
      vm.expenses = data;
      Filter.all().success(function (data) {
        vm.items = data;
        redrawPeriod();
        vm.piechart();
      });
    });
    
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
      if(typeof vm.me !== 'undefined'){
        fltrd = $filter("onlyaccepted")(vm.expenses);
        fltrd = $filter("periodfor")(fltrd, item.period, new Date(item.date));
        fltrd = $filter("tagsfilter")(fltrd, item.filter, vm.me.email);
        amount = $filter("calctotalfor")(fltrd, vm.me.email);
        rows.push({c: [{v: ""+item.filter+" ("+parseInt(amount)+")"},{v: parseInt(amount) }]});
      }
  });

  $scope.chartObject.type = "PieChart";

  $scope.chartObject.data = {
      "cols": cols, 
      "rows": rows};

  console.log(rows);
}

})

