(function() {
    'use strict';

    angular
        .module('openeApp')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$location', 'authService', 'userService'];

    function AuthController($location, authService, userService) {
        var vm = this;

        vm.login = login;
        vm.logout = logout;
        vm.loggedin = loggedin;

        function login(username, password) {
            authService.login(username, password).then(function(response) {
                userService.getPerson(username).then(function(response) {
                    vm.user = response;
                });
                $location.path('#/');
            });
        }

        function logout() {
            authService.logout().then(function(response) {
                delete vm.user;
                $location.path('#/login');
            });
        }

        function loggedin() {
            return authService.loggedin();
        }
    }
})();
