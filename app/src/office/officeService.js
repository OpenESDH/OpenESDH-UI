
    angular
        .module('openeApp.office')
        .factory('officeService', officeService);

    function officeService($http) {
        var service = {
            saveEmail: saveEmail
        };
        return service;

        function saveEmail(data) {
            return $http.post('/alfresco/service/dk-openesdh-case-email', data).then(function(response) {
                return response.data;
            }, function(error) {
            })
        }
    }