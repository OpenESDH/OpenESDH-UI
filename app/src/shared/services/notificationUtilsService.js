(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('notificationUtilsService', notificationUtilsService);

    function notificationUtilsService() {
        var service = {
            notify: notify
        };
        return service;

        function notify(message, toastPosition) {
            angular.extend(toastPosition, {
                bottom: true,
                top: false,
                left: false,
                right: true
            });
            var getToastPosition = function () {
                return Object.keys(toastPosition)
                    .filter(function(pos) { return vm.toastPosition[pos]; })
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
