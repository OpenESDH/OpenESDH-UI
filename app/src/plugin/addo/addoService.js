angular
        .module('openeApp.addo')
        .factory('addoService', addoService);

function addoService($http, $q) {
    var service = {
        saveAddoPassword: saveAddoPassword,
        getSigningTemplates: getSigningTemplates,
        initiateSigning: initiateSigning
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

    function getSigningTemplates() {
        return $http.get('/alfresco/s/api/vismaaddo/SigningTemplates').then(function(response) {
            return response.data.SigningTemplateItems.SigningTemplate;
        });
    }

    function initiateSigning(data) {
        return $http.post('/alfresco/s/api/vismaaddo/InitiateSigning', data).then(function(response) {
            return response.data;
        });
    }
}