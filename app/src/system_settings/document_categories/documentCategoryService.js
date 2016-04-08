
    angular
            .module('openeApp.systemsettings')
            .factory('documentCategoryService', documentCategoryService);

    function documentCategoryService($http) {
        return {
            getClassifierValues: getClassifierValues,
            saveClassifierValue: saveClassifierValue,
            deleteClassifierValue: deleteClassifierValue
        };

        function getClassifierValues() {
            return $http.get('/api/openesdh/document/categories')
                    .then(onSuccess);
        }
        
        function saveClassifierValue(documentCategory) {
            return $http.post('/api/openesdh/document/category', documentCategory).then(onSuccess);
        }

        function deleteClassifierValue(nodeRefId) {
            return $http.delete('/api/openesdh/document/category',
                    {params: {
                            nodeRefId: nodeRefId
                        }
                    }).then(onSuccess);
        }

        function onSuccess(response) {
            return response.data;
        }
    }