angular.module('userApp', 
    ['ui.bootstrap', 'ngTagsInput', 'mgcrea.ngStrap', 'ngAnimate', 
    'app.routes', 'authService', 'budgetService', 'filterService', 'mainCtrl', 
    'userCtrl', 'homeCtrl', 'meCtrl', 'chartsCtrl','newexCtrl', 'viewexCtrl', 'newfrndCtrl',
    'friendsCtrl', 'userService', 'sharedCtrl', 'edtgsCtrl', 'googlechart'])
        // application configuration to integrate token into requests
        .config(function ($httpProvider) {
            // attach our auth interceptor to the http requests
            $httpProvider.interceptors.push('AuthInterceptor');
        })

        .directive('navbar', function () {
            return {
                restrict: 'E',
                scope: {
                    loggedin: '@',
                    usermail: '@',
                    useradmin: '@'
                },
                templateUrl: 'app/views/pages/components/navbar.html',
                controller: function ($scope, $attrs, $location, $uibModal, $timeout, Auth) {
                    var vm = this;
                    vm.loggedin = false;
                    vm.useradmin = false;
                    vm.usermail = '';

                    $attrs.$observe('loggedin', function(value) {
                        if(value == 'true'){
                            vm.loggedin = true;
                        } else {
                            vm.loggedin = false;
                        }
                    });
                    $attrs.$observe('useradmin', function(value) {
                        if(value == 'true'){
                            vm.useradmin = true;
                        } else {
                            vm.useradmin = false;
                        }
                    });
                    $attrs.$observe('usermail', function(value) {
                        if(value && value.length > 0){
                            vm.usermail = value
                        }
                    });

                    vm.doLogout = function () {
                        Auth.logout();
                        $timeout(
                            function(){
                                vm.loggedin = false;
                                vm.useradmin = false;
                                vm.usermail = '';
                                $location.path('/');
                            }, 900
                        );
                    };

                    vm.doTest = function () {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'app/views/pages/private/editme.html',
                            controller: 'meController',
                            controllerAs: 'main',
                            resolve: {}
                        });
                        modalInstance.result.then(
                            function () {
                                console.log('Modal ok at: ' + new Date());
                            }, 
                            function () {
                                console.log('Modal dismissed at: ' + new Date());
                            }
                        );
                    };

                },
                controllerAs: 'nb'
            }
        })



        .directive('infobar', function () {
            return {
                restrict: 'E',
                scope: {
                    danger: '@',
                    success: '@'
                },
                templateUrl: 'app/views/pages/components/infobar.html',
                controller: function ($scope, $attrs, $timeout) {
                    var vm = this;
                    vm.successS = false;
                    vm.dangerS = false;

                    $attrs.$observe('danger', function(newMessage) {
                        if(newMessage && newMessage.length > 0){
                            newMessage = newMessage.substring(0, newMessage.indexOf(":::"));
                            vm.danger = newMessage;
                            vm.dangerS = true;
                            $timeout(function(){vm.dangerS = false;}, 3000);
                        }
                    });

                    $attrs.$observe('success', function(newMessage) {
                        if(newMessage && newMessage.length > 0){
                            newMessage = newMessage.substring(0, newMessage.indexOf(":::"));
                            vm.success = newMessage;
                            vm.successS = true;
                            $timeout(function(){vm.successS = false;}, 3000);
                        }
                    });
                    vm.closeDanger = function () {
                        //$attrs.$set('danger', "a");
                        vm.dangerS = false;
                    };
                    vm.closeSuccess = function () {
                        vm.successS = false;
                    };
                },
                controllerAs: 'ib'
            }
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
                            if( e.user != user ) {
                                notMy += e.amount;
                            }
                        });
                        toReturn = expense.amount - notMy;
                    } else {
                        expense.shares.forEach (function (e){
                            if(e.user == user && e.payback == false && e.loan != true){
                                toReturn = e.amount;
                            }
                        });

                    }
                return toReturn.toFixed(2);
            }             
        })
        .filter('payedforshared', function() {
                return function(expense, user, userfor) {
                    toReturn = '';
                    if(expense.owner == user){
                        var payedForOther = 0;
                        expense.shares.forEach (function (e){
                            if(e.user == userfor){
                               payedForOther += e.amount;
                            }
                        });
                        toReturn = payedForOther.toFixed(2);
                    } 
                    return toReturn;
                }             
            })
            .filter('periodfor', function() {
                return function(input, period, date) {
                    var filtered = [];
                    angular.forEach(input, function(item) {
                        current = new Date(item.date);
                        if(period === "y"){
                            if(current.getFullYear() === date.getFullYear()){
                                filtered.push(item);
                            }
                        }else{
                            if(current.getFullYear() === date.getFullYear() && current.getMonth() === date.getMonth()){
                                filtered.push(item);
                            }
                        }
                    });
                    return filtered;
                };
            })
             .filter('pgnte', function() {
                return function(input, page) {
                    btm = (page - 1) * 20;
                    tp = ((page - 1) * 20) + 20;
                    if(tp > input.length) 
                        tp = input.length;
                    return input.slice(btm, tp);
                };
            })
            .filter('sortbdate', function() {
                return function(input) {
                    input.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });
                    return input;
                };
            })
            .filter('calctotalfor', function() {
                return function(input, user, mode) {
                    var total = 0;
                    angular.forEach(input, function(expense) { 
                           var toReturn = 0;
                                if(expense.owner == user){
                                    notMy = 0;
                                    expense.shares.forEach (function (e){
                                        if( e.user != user ){
                                            notMy += e.amount;
                                        }
                                    });
                                    toReturn = expense.amount - notMy;
                                } else {
                                    expense.shares.forEach (function (e){
                                        if(e.user == user && e.payback == false && e.loan != true){
                                            toReturn = e.amount;
                                        }
                                    });
                                }
                        total += toReturn;
                    });
                    return total.toFixed(2);
                };
        })
        .filter('tagsfilter', function() {
                return function(input, filter, usermail) {
                    if(!filter || filter.length==0){
                        return input;
                    }
                    var filters = filter.split(" ");
                    var filtered = [];
                    angular.forEach(input, function(item) {
                        tgs = [];
                        angular.forEach(item.shares, function(share) {
                            if(share.user === usermail){
                                tgs = share.tags;
                            }
                        });
                        cr = true;
                        angular.forEach(filters, function(fltr) {
                            if(fltr.startsWith("-") && 2 < fltr.length){
                                fltrM = fltr.substring(1);
                                tgs.filter(function (el) {
                                    if(el.text.indexOf(fltrM) === 0){
                                        cr = false;
                                    }
                                }); 
                            }
                            if(cr && !fltr.startsWith("-") && 1 < fltr.length){
                                cr2 = false; 
                                tgs.filter(function (el) {
                                    if(el.text.indexOf(fltr) === 0){
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
            return total.toFixed(2);
            };
        })
        .filter('calcdiff', function() {
            return function(input, user, userfor) {

            var totalUser = 0;
            angular.forEach(input, function(item) {
                if(item.owner == user){
                    item.shares.filter(function (el) {
                        if(el.user === userfor){
                            totalUser += el.amount;
                        }
                    });
                }
            });

            var totalFor = 0;
            angular.forEach(input, function(item) {
                if(item.owner == userfor){
                    item.shares.filter(function (el) {
                        if(el.user === user){
                            totalFor += el.amount;
                        }
                    });
                }
            });

            if(totalUser > totalFor){
                return userfor +" ows you " +(totalUser - totalFor) + " for the selected period!";
            }
            if(totalUser < totalFor){
                return  "You owe " +userfor+" "+(totalFor - totalUser) + " for the selected period!";
            }

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
        .filter('onlyaccepted', function() {
            return function(input) {
            var filtered = [];
            angular.forEach(input, function(item) {
                if(item.accepted ){
                    filtered.push(item);
                } 
            });
            return filtered;
            };
        }) 
        .filter('onlymyrejected', function() {
            return function(input, user) {
            var filtered = [];
            angular.forEach(input, function(item) {
                if(!item.rejected || item.owner === user){
                    filtered.push(item);
                } 
            });
            return filtered;
            };
        })    
;

