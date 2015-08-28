(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('sessionService', sessionService);

    sessionService.$inject = ['$window'];

    function sessionService($window) {
        var service = {
            getUserInfo: getUserInfo,
            setUserInfo: setUserInfo
        };

        init();

        return service;

        var userInfo;

        function init() {
            if ($window.sessionStorage['userInfo']) {
                userInfo = JSON.parse($window.sessionStorage['userInfo']);
            }
        }

        function getUserInfo() {
            return userInfo;
        }

        function setUserInfo(info) {
            userInfo = info;
            $window.sessionStorage['userInfo'] = JSON.stringify(userInfo);
        }
    }
})();
