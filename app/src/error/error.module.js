angular.module('openeApp.error', ['ngMaterial'])
        .config(config);

function config($httpProvider){
    $httpProvider.interceptors.push('RequestsErrorHandler');
}