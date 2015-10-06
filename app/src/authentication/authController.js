(function() {
    'use strict';

    angular
        .module('openeApp')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', '$state', 'authService', 'userService'];

    function AuthController($scope, $state, authService, userService) {
        var vm = this;

        vm.login = login;
        vm.logout = logout;
        vm.loggedin = loggedin;
        vm.getUserInfo = getUserInfo;

        function login(credentials) {
            authService.login(credentials.username, credentials.password).then(function(response) {
                userService.getPerson(credentials.username).then(function(response) {
                    vm.user = response;
                });
                console.log('tostate: ' + $scope.returnToState);
                if ($scope.returnToState) {
                    $state.go($scope.returnToState.name, $scope.returnToStateParams);
                } else {
                    $state.go('dashboard');
                }
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

        function getUserInfo() {
            var userInfo = authService.getUserInfo();
            return userInfo;
        }
    }
})();
