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

    authService.$inject = ['$http', 'sessionService'];

    function authService($http, sessionService) {
        var userInfo;
        var service = {
            login: login,
            logout: logout,
            loggedin: loggedin
        };

        return service;

        function login(username, password) {
            return $http.post("/alfresco/service/api/login", {username: username, password: password}).then(function(response) {
                userInfo = {
                    ticket: response.data.data.ticket,
                    userName: username
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
    }
})();
