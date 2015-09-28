(function() {
    'use strict';

    angular
        .module('openeApp')
        .config(config)
        .factory('httpTicketInterceptor', httpTicketInterceptor)
        .factory('authService', authService);

    function config($httpProvider) {
        $httpProvider.interceptors.push('httpTicketInterceptor');
        $httpProvider.defaults.headers.common.Authorization = undefined;
    }

    httpTicketInterceptor.$inject = ['sessionService'];

    function httpTicketInterceptor(sessionService) {
        var service = {
            request: request
        };
        return service;

        function request(config) {
            if (sessionService.getUserInfo()) {
                config.params = config.params || {};
                config.params.alf_ticket = sessionService.getUserInfo().ticket;
            }
            return config;
        }
    }

    authService.$inject = ['$http', '$window', '$state', 'sessionService', 'userService'];

    function authService($http, $window, $state, sessionService, userService) {
        var userInfo = {};
        var service = {
            login: login,
            logout: logout,
            loggedin: loggedin,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getUserInfo: getUserInfo,
            revalidateTicket: revalidateTicket
        };

        // Revalidate the ticket stored in the session on page load
        angular.element($window).bind('load', revalidateTicket);

        return service;

        function getUserInfo() {
            return sessionService.getUserInfo();
        }

        function login(username, password) {
            return $http.post("/alfresco/service/api/login", {username: username, password: password}).then(function(response){
                var ticket = response.data.data.ticket;
                userInfo['ticket'] = ticket;
                sessionService.setUserInfo(userInfo);
                return userService.getPerson(username);
            }).then(function(response) {
                userInfo['user'] = response;
                sessionService.setUserInfo(userInfo);
                return response;
            }, function(reason) {
                console.log(reason);
            });
        }

        function logout() {
            var userInfo = sessionService.getUserInfo();
            if (userInfo && userInfo.ticket) {
                return $http.delete('/alfresco/service/api/login/ticket/' + userInfo.ticket).then(function(response) {
                    sessionService.setUserInfo(null);
                    return response;
                });
            }
        }

        function loggedin() {
            return sessionService.getUserInfo();
        }

        function isAuthenticated() {
            return sessionService.getUserInfo();
        }

        function isAuthorized(authorizedRoles) {
            var userInfo = sessionService.getUserInfo();
            if (typeof userInfo === 'undefined') {
                return false;
            }
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            //TODO refactor when we have more role types
            //We should loop through each authorized role and return true as soon as we detect a true value
            //As we have only two roles we need only to return whether the user is an admin or return the inverse of
            //user.isAdmin when the user role is set to user (i.e. return true if the user is not admin when the role is
            //user
            for(var n = 0; n < authorizedRoles.length; n++){
                //if admin we don't care return true immediately
                if(userInfo.user.capabilities.isAdmin)
                    return true;
                if (authorizedRoles[n] == 'user')
                    return !userInfo.user.capabilities.isAdmin;
            }
            return false;
        }

        function revalidateTicket() {
            // Re-validate the login ticket
            var userInfo = sessionService.getUserInfo();
            if (userInfo && 'ticket' in userInfo) {
                return $http.get("/alfresco/service/api/login/ticket/" + userInfo.ticket).then(function (response) {
                    if (response.status !== 200) {
                        // The ticket is expired or not valid for this user,
                        // Clear the session information
                        sessionService.setUserInfo(null);
                        $state.go('login');
                    }
                }, function (e) {
                    sessionService.setUserInfo(null);
                    $state.go('login');
                });
            }
        }
    }
})();
