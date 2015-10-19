
    angular
        .module('openeApp')
        .factory('notificationUtilsService', notificationUtilsService);

    function notificationUtilsService($mdToast, $translate) {
        var service = {
            notify: notify,
            alert: alert
        };

        var defaultToastPosition = "top right";
        var defaultAlertToastPosition = "top right";

        return service;

        function notify(message, toastPosition) {
            if (typeof toastPosition === 'undefined') {
                toastPosition = defaultToastPosition;
            }
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(toastPosition)
                    .hideDelay(3000)
            );
        }

        function alert(message, toastPosition) {
            if (typeof toastPosition === 'undefined') {
                toastPosition = defaultAlertToastPosition;
            }
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .action($translate.instant('COMMON.OK'))
                    .highlightAction(true)
                    .position(toastPosition)
                    .hideDelay(0)
            );
        }
    }