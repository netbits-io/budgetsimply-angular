angular.module('userApp', 
        ['ui.bootstrap', 'ngTagsInput', 'mgcrea.ngStrap', 'ngAnimate', 
         'app.routes', 'authService', 'budgetService', 'mainCtrl', 
         'userCtrl', 'homeCtrl', 'meCtrl', 'newexCtrl', 
         'userService', 'sharedCtrl'])
        // application configuration to integrate token into requests
        .config(function ($httpProvider) {
            // attach our auth interceptor to the http requests
            $httpProvider.interceptors.push('AuthInterceptor');
        })
        .directive('passwordMatch', [function () {
            return {
                restrict: 'A',
                scope: true,
                require: 'ngModel',
                link: function (scope, elem, attrs, control) {
                    var checker = function () {
                            //get the value of the first password
                            var e1 = scope.$eval(attrs.ngModel);
                            //get the value of the other password  
                            var e2 = scope.$eval(attrs.passwordMatch);
                            return e1 == e2;
                        };
                    scope.$watch(checker, function (n) {
                            //set the form control to valid if both 
                            //passwords are the same, else invalid
                        control.$setValidity("unique", n);
                    });
                }
            };
        }])
        .filter('payedfor', function() {
            return function(expense, user) {
                var toReturn = 0;
                if(expense.owner == user){
                    notMy = 0;
                    expense.shares.forEach (function (e){
                        if(e.user != user){
                           notMy += e.amount | 0;
                        }
                    });
                    if(notMy != 0){
                         toReturn = expense.amount+" -"+notMy;
                    } else {
                        toReturn = expense.amount;  
                    }

                } else {
                    expense.shares.forEach (function (e){
                        if(e.user == user){
                            toReturn = e.amount | 0;
                        }
                    });
                    toReturn = "+"+toReturn;
                }
                return toReturn;
            }             
        })
        .filter('payedforshared', function() {
            return function(expense, user, userfor) {
                toReturn = '';
                if(expense.owner == user){
                    var payedForOther = 0;
                    expense.shares.forEach (function (e){
                        if(e.user == userfor){
                           payedForOther += e.amount | 0;
                        }
                    });
                    toReturn = payedForOther;
                } 
                return toReturn;
            }             
        })
        .filter('periodfor', function() {
            return function(input, periodString) {
                var filtered = [];
                    angular.forEach(input, function(item) {
                        date = JSON.stringify(item.date)
                    if(date.indexOf(periodString) != -1) {
                        filtered.push(item);
                    }
                });
                return filtered;
            };
        })
        .filter('calctotal', function() {
            return function(input) {
                var total = 0;
                angular.forEach(input, function(item) {
                    if(! isNaN (item.amount-0) && item.amount != null)
                        total += item.amount;
                });
                return total;
            };
        })
        .filter('calctotalfor', function() {
            return function(input, payer) {
                var total = 0;
                angular.forEach(input, function(item) {
                    item.shares.filter(function (el) {
                        if(el.user === payer){
                            total += el.amount;
                        }
                    });
                });
                return total;
            };
        })
        .filter('calctotalforshared', function() {
            return function(input, user, userfor) {
                var total = 0;
                angular.forEach(input, function(item) {
                    if(item.owner == user){
                        item.shares.filter(function (el) {
                            if(el.user === userfor){
                                total += el.amount;
                            }
                        });
                    }
                });
                return total;
            };
        })
         .filter('onlyshared', function() {
            return function(input, user, userfor) {
                var filtered = [];
                angular.forEach(input, function(item) {
                    if(item.owner === user){
                        item.shares.filter(function (el) {
                            if(el.user === userfor){
                                filtered.push(item);
                            }
                        });
                    } else if(item.owner === userfor){
                        filtered.push(item);
                    }
                });
                return filtered;
            };
        })
        ;

