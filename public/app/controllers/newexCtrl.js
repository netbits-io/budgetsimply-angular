angular.module('newexCtrl', ['budgetService'])

.controller('newexController', function ($scope, Auth, $uibModalInstance, Budget, Auth) {
    var vm = this;

    Auth.getUser().then(function (data) {
        vm.me = data.data;
    });

    vm.ok = function () {
        forme = vm.payed;
        vm.shares.filter(function(el){
            forme = forme - el.amount;
        });
        vm.shares.push({user: vm.me.email, accepted: true, amount: forme});
        Budget.addExpense($scope.dt, $scope.tags, vm.note, vm.payed, vm.shares).success(function (data) {
            $uibModalInstance.close('ok');
        });
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.shares = [];

    vm.sharePlus = function () {
        vm.shares.push({user: '', accepted: false});
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
        return $scope.allTags.filter(function(item) {
            return item.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

});