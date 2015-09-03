(function(){
    'use strict';
    angular
        .module('openeApp.documents')
        .factory('documentService', documentService);

    documentService.$inject = ['$http'];

    function documentService($http, $resource) {
        var service = {
            getDocuments: getDocuments,
            getFavoriteDocuments: getFavoriteDocuments
        };

        return service;

        function getDocuments() {
            return $http.get('/alfresco/s/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
                params: {max: 50, filter: 'recentlyModifiedByMe'}
            }).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        function getFavoriteDocuments() {
            return $http.get('/alfresco/s/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
                params: {max: 50, filter: 'favourites'}
            }).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        function getEditingDocuments() {
            return $http.get('/alfresco/s/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
                params: {
                    max: 50,
                    filter: 'editingMe'
                }
            }).then(function(response) {
                console.log(response);
                return response.data;
            });
        }
    }
})();
