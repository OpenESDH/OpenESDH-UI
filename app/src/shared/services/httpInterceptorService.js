
    angular
        .module('openeApp')
        .config(config)
        .factory('httpInterceptor', httpInterceptor);

    function config($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // start the spinner here
            document.getElementById('loader').style.visibility = "visible";
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    };

// register the interceptor as a service, intercepts ALL angular ajax http calls
    function httpInterceptor($q, $window) {
        return {
            'response': function(response) {
                document.getElementById('loader').style.visibility = "hidden";
                return response;
            },

            'responseError': function(rejection) {
                document.getElementById('loader').style.visibility = "hidden";
                return $q.reject(rejection);
            }
        }
    };