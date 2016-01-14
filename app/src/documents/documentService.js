
    angular
        .module('openeApp.documents')
        .factory('documentService', documentService);

    function documentService($http) {
        var service = {
            getDocuments: getDocuments,
            getFavoriteDocuments: getFavoriteDocuments
        };

        return service;

        function getDocuments() {
            return $http.get('/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
                params: {max: 50, filter: 'recentlyModifiedByMe'}
            }).then(function(response) {
                return response.data;
            });
        }

        function getFavoriteDocuments() {
            return $http.get('/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
                params: {max: 50, filter: 'favourites'}
            }).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        function getEditingDocuments() {
            return $http.get('/slingshot/doclib/doclist/documents/node/alfresco/company/home', {
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