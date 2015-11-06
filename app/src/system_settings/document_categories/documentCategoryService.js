
    angular
            .module('openeApp.systemsettings')
            .factory('documentCategoryService', documentCategoryService);

    function documentCategoryService($http) {
        var service = {
            getDocumentCategories: getDocumentCategories,
            getDocumentCategory: getDocumentCategory,
            saveDocumentCategory: saveDocumentCategory,
            deleteDocumentCategory: deleteDocumentCategory
        };
        return service;

        function getDocumentCategories() {
            return $http.get('/alfresco/service/api/openesdh/document/categories')
                    .then(onSuccess);
        }

        function getDocumentCategory(nodeRefId) {
            return $http.get('/alfresco/service/api/openesdh/document/category',
                    {
                        params: {
                            nodeRefId: nodeRefId
                        }
                    }).then(onSuccess);
        }

        function saveDocumentCategory(documentCategory) {
            return $http.post('/alfresco/service/api/openesdh/document/category', null,
                    {
                        params: {
                            nodeRefId: documentCategory.nodeRef,
                            name: documentCategory.name,
                            mlDisplayNames: documentCategory.mlDisplayNames
                        }
                    }).then(onSuccess);
        }

        function deleteDocumentCategory(nodeRefId) {
            return $http.delete('/alfresco/service/api/openesdh/document/category',
                    {params: {
                            nodeRefId: nodeRefId
                        }
                    }).then(onSuccess);
        }

        function onSuccess(response) {
            return response.data;
        }
    }