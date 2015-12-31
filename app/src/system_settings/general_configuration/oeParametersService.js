
angular
        .module('openeApp.systemsettings')
        .factory('oeParametersService', oeParametersService);

function oeParametersService($http, $q, $window) {
    var service = {
        getParameters: getParameters,
        getParameter: getParameter,
        saveParameters: saveParameters,
        clearOEParameters: clearOEParameters
    };
    _init();
    return service;

    var _oeParameters;

    function _init() {
        _oeParameters = angular.fromJson($window.sessionStorage.getItem('oeParameters')) || {};
    }

    function getParameters() {
        return $http.get('/alfresco/service/api/openesdh/parameters').then(function(response) {
            return response.data;
        });
    }

    function getParameter(oeParameterName) {
        if (_oeParameters[oeParameterName] !== undefined) {
            return $q.resolve(_oeParameters[oeParameterName]);
        }

        return $http.get('/alfresco/service/api/openesdh/parameter/' + oeParameterName)
                .then(function(response) {
                    _oeParameters[response.data.name] = response.data.value;
                    _saveOEParamsToSession(_oeParameters);
                    return response.data.value;
                });
    }

    function saveParameters(oeParameters) {
        return $http.post('/alfresco/service/api/openesdh/parameters', oeParameters)
                .then(function(response) {
                    _saveOEParamsToSession(oeParameters);
                    return response.data;
                });
    }

    function _saveOEParamsToSession(oeParameters) {
        _oeParameters = oeParameters;
        $window.sessionStorage.setItem('oeParameters', angular.toJson(_oeParameters));
    }

    function clearOEParameters() {
        _saveOEParamsToSession({});
    }
}