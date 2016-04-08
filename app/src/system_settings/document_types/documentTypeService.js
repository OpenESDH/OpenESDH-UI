
    angular
            .module('openeApp.systemsettings')
            .factory('documentTypeService', documentTypeService);

    function documentTypeService($http) {
        return {
            getClassifierValues: getClassifierValues,
            saveClassifierValue: saveClassifierValue,
            deleteClassifierValue: deleteClassifierValue
        };

        function getClassifierValues() {
            return $http.get('/api/openesdh/document/types')
                    .then(onSuccess);
        }

        function saveClassifierValue(documentType) {
            return $http.post('/api/openesdh/document/type', documentType).then(onSuccess);
        }

        function deleteClassifierValue(nodeRefId) {
            return $http.delete('/api/openesdh/document/type',
                    {params: {
                            nodeRefId: nodeRefId
                        }
                    }).then(onSuccess);
        }

        function onSuccess(response) {
            return response.data;
        }
    }