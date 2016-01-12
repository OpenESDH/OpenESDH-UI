
    angular
        .module('openeApp.classification')
        .factory('classificationService', classificationService);

    function classificationService($http, userService, alfrescoNodeUtils) {
        var service = {
            search: search
        };
        return service;

        function search(query, field) {
            return $http.get('/api/openesdh/classification/search', {params: {term: query, field: field}}).then(function (response) {
                return response.data;
            });
        }
    }