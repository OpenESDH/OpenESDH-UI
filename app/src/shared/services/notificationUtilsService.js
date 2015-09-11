(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('notificationUtilsService', notificationUtilsService);

    notificationUtilsService.$inject = ['$mdToast'];

    function notificationUtilsService($mdToast) {
        var service = {
            notify: notify
        };
        return service;

        function notify(message, toastPosition) {
            if (typeof toastPosition === 'undefined') {
                toastPosition = {
                    bottom: true,
                    top: false,
                    left: false,
                    right: true
                };
            }
            var getToastPosition = function () {
                return Object.keys(toastPosition)
                    .filter(function(pos) { return toastPosition[pos]; })
                    .join(' ');
            };
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(getToastPosition())
                    .hideDelay(3000)
            );
        }
    }
})();
