angular
        .module('openeApp.addo')
        .factory('addoService', addoService);

function addoService($http, $q) {
    var service = {
        saveAddoUser: saveAddoUser,
        getSigningTemplates: getSigningTemplates,
        initiateSigning: initiateSigning,
        getAddoUserProperties: getAddoUserProperties,
        isAddoAccountConfigured: isAddoAccountConfigured
    };
    return service;

    function saveAddoUser(username, addoUsername, addoPassword) {
        if (addoUsername && addoPassword) {
            return $http.post('/alfresco/s/api/openesdh/addo/' + encodeURIComponent(username) + '/save', null,
                    {params: {
                            'addoUsername': addoUsername,
                            'addoPassword': addoPassword
                        }
                    }
            ).then(function(response) {
                return response.data;
            });
        }
        return $q.resolve();
    }

    function getSigningTemplates() {
        return $http.get('/alfresco/s/api/openesdh/addo/SigningTemplates').then(function(response) {
            return response.data.SigningTemplateItems.SigningTemplate;
        });
    }

    function initiateSigning(data) {
        return $http.post('/alfresco/s/api/openesdh/addo/InitiateSigning', data).then(function(response) {
            return response.data;
        });
    }

    function getAddoUserProperties(username) {
        return $http.get('/alfresco/s/api/openesdh/addo/' + username + '/props').then(function(response) {
            return response.data;
        });
    }
    function isAddoAccountConfigured() {
        return $http.get('/alfresco/s/api/openesdh/addo/props').then(function(response) {
            return response.data.configured;
        });
    }
}