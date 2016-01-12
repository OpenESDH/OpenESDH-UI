
angular
        .module('openeApp.systemsettings')
        .factory('oeParametersService', oeParametersService);

function oeParametersService($http, $window) {
    var service = {
        getParameters: getParameters,
        getParameter: getParameter,
        loadParameters: loadParameters,
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
        return $http.get('/api/openesdh/parameters').then(function(response) {
            return response.data;
        });
    }

    function getParameter(oeParameterName) {
        return _oeParameters[oeParameterName];
    }

    function saveParameters(oeParams) {
        return $http.post('/api/openesdh/parameters', oeParams)
                .then(function(response) {
                    _saveOEParamsToSession(_transformParameters(oeParams));
                    return response.data;
                });
    }

    function _saveOEParamsToSession(oeParameters) {
        _oeParameters = oeParameters;
        $window.sessionStorage.setItem('oeParameters', angular.toJson(_oeParameters));
    }

    function _transformParameters(oeParams) {
        var params = {};
        angular.forEach(oeParams, function(par) {
            params[par.name] = par.value;
        });
        return params;
    }

    function loadParameters() {
        getParameters().then(function(oeParams){
            _saveOEParamsToSession(_transformParameters(oeParams));
        });
    }

    function clearOEParameters() {
        _saveOEParamsToSession({});
    }
}