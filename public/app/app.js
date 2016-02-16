angular.module('userApp', 
        ['ui.bootstrap', 'ngTagsInput', 'mgcrea.ngStrap', 'ngAnimate', 
         'app.routes', 'authService', 'budgetService', 'mainCtrl', 
         'userCtrl', 'homeCtrl', 'meCtrl', 'newexCtrl', 'newbdgCtrl', 
         'userService', 'shareBCtrl'])
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
            return function(payed, user) {
                var toReturn = 0;
                payed.forEach (function (e){
                    if(e.payer == user){
                        toReturn = e.amount | 0;
                    }
                });
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
        ;