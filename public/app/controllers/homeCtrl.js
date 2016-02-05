angular.module('homeCtrl', [])

.controller('homeController', function($scope) {
	var vm = this;

  $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.today();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd.MM.yyyy';

  $scope.popup1 = {
    opened: false
  };

  $scope.tags = [
  { text: 'just' },
  { text: 'some' }
  ];
  
  $scope.loadTags = function() {
    return [
    { "text": "tag1" },
    { "text": "tag2" },
    { "text": "tag3" },
    { "text": "tag4" },
    { "text": "tag5" },
    { "text": "tag6" },
    { "text": "tag7" },
    { "text": "tag8" },
    { "text": "tag9" },
    { "text": "tag10" }
    ];
  };


  $scope.budgets = [
    'budget1',
    'budget2',
    'budget3',
  ];
  $scope.budget = $scope.budgets[0];

  $scope.toggle = function(open) {
    $scope.budget = $scope.budgets[open];
    console.log('Dropdown is now: ', open);
  };

})

