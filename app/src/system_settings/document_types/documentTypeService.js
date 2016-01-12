
    angular
            .module('openeApp.systemsettings')
            .factory('documentTypeService', documentTypeService);

    function documentTypeService($http) {
        var service = {
            getDocumentTypes: getDocumentTypes,
            getDocumentType: getDocumentType,
            saveDocumentType: saveDocumentType,
            deleteDocumentType: deleteDocumentType
        };
        return service;

        function getDocumentTypes() {
            return $http.get('/api/openesdh/document/types')
                    .then(onSuccess);
        }

        function getDocumentType(nodeRefId) {
            return $http.get('/api/openesdh/document/type',
                    {
                        params: {
                            nodeRefId: nodeRefId
                        }
                    }).then(onSuccess);
        }

        function saveDocumentType(documentType) {
            return $http.post('/api/openesdh/document/type', null,
                    {
                        params: {
                            nodeRefId: documentType.nodeRef,
                            name: documentType.name,
                            mlDisplayNames: documentType.mlDisplayNames
                        }
                    }).then(onSuccess);
        }

        function deleteDocumentType(nodeRefId) {
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