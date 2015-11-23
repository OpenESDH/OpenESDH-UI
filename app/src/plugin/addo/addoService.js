angular
        .module('openeApp.addo')
        .factory('addoService', addoService);

function addoService($http, $q) {
    var service = {
        saveAddoPassword: saveAddoPassword
    };
    return service;

    function saveAddoPassword(username, addoPassword) {
        if (addoPassword) {
            return $http.post('/alfresco/s/api/openesdh/addo/' + encodeURIComponent(username) + '/save', null, {params: {'addoPassword': addoPassword}})
                    .then(function(response) {
                        return response.data;
                    });
        }
        return $q.resolve();
    }
}