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
            return function(expense, user, mode) {
                var toReturn = 0;
                if(expense.owner == user){
                    notMy = 0;
                    expense.shares.forEach (function (e){
                        if(e.user != user){
                           notMy += e.amount | 0;
                        }
                    });
                    if(notMy != 0){
                        if(mode.startsWith("total")){
                            toReturn = expense.amount;
                        } else {
                            toReturn = expense.amount - notMy;
                        }
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
            return function(input, payer, mode) {
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
        .filter('tagsfilter', function() {
            return function(input, filter) {
                if(!filter || filter.length==0){
                    return input;
                }
                var filters = filter.split(" ");
                var filtered = [];
                angular.forEach(input, function(item) {
                    cr = true;
                        angular.forEach(filters, function(fltr) {
                            if(fltr.startsWith("-") && 2 < fltr.length){
                                fltrM = fltr.substring(1);
                                item.tags.filter(function (el) {
                                    if(el.text.indexOf(fltrM) != -1){
                                        console.log(el.text);
                                        cr = false;
                                    }
                                }); 
                            }
                            if(cr && !fltr.startsWith("-") && 1 < fltr.length){
                                cr2 = false; 
                                item.tags.filter(function (el) {
                                    if(el.text.indexOf(fltr) != -1){
                                        cr2 = true;
                                    }
                                }); 
                                cr = cr2;
                            }
                        }); 
                    if(cr) filtered.push(item);
                });
                return filtered;
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
        .directive('bootstrapSwitch', [
        function() {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    element.bootstrapSwitch();

                    element.on('switchChange.bootstrapSwitch', function(event, state) {
                        if (ngModel) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });

                    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
    ])
     ;

