angular.module('chartsCtrl', [])

.controller('chartsController', function($route, $scope, $uibModal, Budget, Auth, $filter, $timeout, User) {

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
      redrawPeriod();
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


Auth.getUser().then(function (data) {
  vm.me = data.data;
  vm.loggedin = true;
  vm.usermail = vm.me.email;
  vm.useradmin = vm.me.admin;
  redraw();
});


vm.items = [
  {filter: "food", amount: 300, period: "April"},
  {filter: "transp", amount: 100, period: "April"},
  {filter: "dom-potrebi", amount: 100, period: "April"}
];


vm.piechart = function(){
  $scope.chartObject.data = {};

  cols = [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
  ];

  rows = [];
  vm.items.filter(function(item){
    rows.push({c: [{v: item.filter},{v: item.amount}]});
  });

  $scope.chartObject.type = "PieChart";

  $scope.chartObject.data = {
      "cols": cols, 
      "rows": rows};

  console.log(rows);
}

vm.piechart();

})

