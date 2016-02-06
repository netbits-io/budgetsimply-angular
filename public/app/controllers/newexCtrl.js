angular.module('newexCtrl', [])

.controller('newexController', function ($scope, Auth, $uibModalInstance) {
    var vm = this;

    vm.ok = function () {
        $uibModalInstance.close('ok');
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

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

    $scope.tags = [];
    $scope.allTags = [
    { "text": "food" },
    { "text": "workfood" },
    { "text": "cats" },
    { "text": "car" },
    { "text": "petrol" },
    { "text": "bills" },
    { "text": "stuff" }
    ];

    $scope.loadTags = function($query) {
        console.log($query);
        return $scope.allTags.filter(function(item) {
            return item.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

});