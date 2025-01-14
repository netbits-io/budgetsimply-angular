angular.module('mainCtrl', [])

.controller('mainController', function ($rootScope, $location, $routeParams, Auth, $uibModal) {
    var vm = this;
    vm.loggedin = false
    vm.usermail = '';
    vm.useradmin = false;

    checkOnEveryRequest = function (event, next, current) {
        vm.loggedIn = Auth.isLoggedIn();
        if (!vm.loggedIn) {
            if (next.templateUrl.indexOf("app/views/pages/private/") >= 0) {
                $location.path("/");
            }
            if (next.templateUrl.indexOf("app/views/pages/admin/") >= 0) {
                $location.path("/");
            }
        } else {
            Auth.getUser().then(function (data) {
                vm.user = data.data;
                if (!vm.user.admin) {
                    if (next.templateUrl.indexOf("app/views/pages/admin/") >= 0) {
                        $location.path("/home");
                    }
                } else {
                    // do nothing for now  
                }
                if (next.templateUrl.indexOf("app/views/pages/public/welcome") >= 0) {
                    $location.path("/home");
                }
            })
        }
    };

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', checkOnEveryRequest);

            Auth.getUser().then(function (data) {
                vm.loggedin = true;
                vm.usermail = data.data.email;
                vm.useradmin = data.data.admin;
            });

            // function to handle login form
            vm.doLogin = function (isValid) {
                if (isValid) {
                    vm.lgnProcessing = true;
                    // clear the error
                    vm.lgnError = '';
                    Auth.login(vm.loginData.email, vm.loginData.password).success(function (data) {
                        vm.lgnProcessing = false;
                        if (data.success) {
                            $location.path('/home');
                        } else {
                            vm.lgnError = data.message;
                            vm.lgnProcessing = false;
                        }
                    });
                }
            };

            vm.doRegister = function (isValid) {
                if (isValid) {
                    vm.regProcessing = true;
                    // clear the error
                    vm.regError = '';
                    Auth.register(vm.registerData.name, vm.registerData.email, vm.registerData.password, vm.registerData.passwordConfirm).success(function (data) {
                        if (data.success) {
                            vm.regSuccess = "Account registered!";
                        } else {
                            vm.regError = data.message;
                        }
                    });
                    vm.regProcessing = false;
                }
            };
            
            vm.doForgot = function (isValid) {
                if (isValid) {
                    vm.fgtProcessing = true;
                    // clear the error
                    vm.fgtError = '';
                    Auth.forgot(vm.forgotEmail).success(function (data) {
                        vm.fgtProcessing = false;
                        if (data.success) {
                            vm.fgtSuccess = data.message;
                        } else {
                            vm.fgtError = data.message;
                            vm.fgtProcessing = false;
                        }
                    });
                }
            };
            vm.doReset = function (isValid) {
                if (isValid) {
                    vm.rstProcessing = true;
                    vm.regError = '';
                    Auth.reset($routeParams.resetToken, vm.resetData.password, vm.resetData.passwordConfirm).success(function (data) {
                        if (data.success) {
                            vm.rstSuccess = data.message;
                        } else {
                            vm.rstError = data.message;
                            vm.rstProcessing = false;
                        }
                    });
                    vm.rstProcessing = false;
                }
            };

        });