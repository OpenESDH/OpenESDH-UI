angular
        .module('openeApp.error')
        .factory('RequestsErrorHandler', RequestsErrorHandler);

function RequestsErrorHandler($q, $injector, $translate) {
    return {
        // --- Response interceptor for handling errors generically ---
        responseError: function(rejection) {
            //unhandled codes
            if (rejection.status === 403) {
                return $q.reject(rejection);
            }
            if (rejection.status === -1 && rejection.config.url.indexOf("/touch") > -1) {
                rejection.status = 401;
                return rejection;
            }

            var error = (rejection.data && rejection.data.error)
                    ? rejection.data.error
                    : {
                        domain: false,
                        code: 'ERROR.UNEXPECTED_ERROR'
                    };

            angular.extend(error, {message: $translate.instant(error.code)});

            if (error.domain !== true) {
                //circular dependency fix:
                var notificationUtilsService = $injector.get("notificationUtilsService");
                notificationUtilsService.notify($translate.instant(error.message));
            }
            return $q.reject(error);
        }
    };
}