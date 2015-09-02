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
            request: request,
            responseError: responseError
        };
        return service;

        function request(config) {
            if (sessionService.getUserInfo()) {
                config.params = config.params || {};
                config.params.alf_ticket = sessionService.getUserInfo().ticket;
            }
            return config;
        }
        function responseError(response) {
            console.log('response interceptor', response);
            if (response.status === 401 || response.status === 403|| response.status === 404) {
                sessionService.setUserInfo(null);
                console.log('In response interceptor: ', response);
            }
            return response;
        }
    }

    authService.$inject = ['$http', 'sessionService', 'userService'];

    function authService($http, sessionService, userService) {
        var userInfo;
        var service = {
            login: login,
            logout: logout,
            loggedin: loggedin,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized
        };

        return service;

        function login(username, password) {
            var ticket;
            return $http.post("/alfresco/service/api/login", {username: username, password: password}).then(function(response){
                console.log(response);
                ticket = response.data.data.ticket;
                return userService.getPerson(username);
            }).then(function(response) {
                console.log(response);
                userInfo = {
                    ticket: ticket,
                    user: response
                };
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
            console.log(userInfo);
            if (typeof userInfo === 'undefined') {
                return false;
            }
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            userInfo.user.capabilities.isAdmin;
//            return (isAuthenticated() && authorizedRoles.indexOf(sessionService.))
            return true;
        }
    }
})();
