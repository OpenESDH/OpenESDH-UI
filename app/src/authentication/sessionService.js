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
            if ($window.sessionStorage.getItem('userInfo')) {
                userInfo = angular.fromJson($window.sessionStorage.getItem('userInfo'));
            }
        }

        function getUserInfo() {
            return userInfo;
        }

        function setUserInfo(info) {
            userInfo = info;
            $window.sessionStorage.setItem('userInfo', angular.toJson(userInfo));
        }
    }
})();
