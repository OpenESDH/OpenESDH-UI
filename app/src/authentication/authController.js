(function() {
    'use strict';

    angular
        .module('openeApp')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$state', 'authService', 'userService'];

    function AuthController($state, authService, userService) {
        var vm = this;

        vm.login = login;
        vm.logout = logout;
        vm.loggedin = loggedin;

        function login(credentials) {
            console.log('logging in as ' + credentials.username);
            authService.login(credentials.username, credentials.password).then(function(response) {
                userService.getPerson(credentials.username).then(function(response) {
                    vm.user = response;
                    console.log(vm.user);
                });
                console.log('going to dashboard');
                $state.go('dashboard');
            });
        }

        function logout() {
            authService.logout().then(function(response) {
                delete vm.user;
                $state.go('login');
            });
        }

        function loggedin() {
            return authService.loggedin();
        }
    }
})();
