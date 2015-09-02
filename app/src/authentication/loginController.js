(function(){
    'use strict';

    angular
        .module('openeApp')
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed'
        })
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', 'AUTH_EVENTS', 'authService'];

    function  LoginController($rootScope, AUTH_EVENTS, authService) {
        var vm = this;

        vm.login = login;

        function login(credentials) {
            authService.login(credentials.username, credentials.password).then(function(response) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }, function() {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        }
    }
})();