angular
        .module('openeApp.error')
        .factory('RequestsErrorHandler', RequestsErrorHandler);

function RequestsErrorHandler($q, $injector, $translate) {
    return {
        // --- Response interceptor for handling errors generically ---
        responseError: function(rejection) {
            //skip hendler
            if (rejection.config.errorHandler && rejection.config.errorHandler === 'skip') {
                return $q.reject(rejection);
            }
            //unhandled codes
            if (rejection.status === 403) {
                return $q.reject(rejection);
            }
            if ((rejection.status === -1 || rejection.status === 401) && (rejection.config.url.indexOf("/touch") > -1)) {
                rejection.status = 401;
                return rejection;
            }
            
            if(rejection.status === -1 && rejection.config.skipCanceled === true){
                return $q.reject(rejection);
            }
            
            //parse error or create default unexpected errror
            var error = (rejection.data && rejection.data.error)
                    ? rejection.data.error
                    : {domain: false};

            //translate error message
            if (error.code && !error.message) {
                angular.extend(error, {message: $translate.instant(error.code, error.props)});
            }

            if (error.domain === false) {
                //circular dependency fix:
                var notificationUtilsService = $injector.get("notificationUtilsService");
                notificationUtilsService.notifyError($translate.instant('ERROR.UNEXPECTED_ERROR'));
            }
            return $q.reject(error);
        }
    };
}