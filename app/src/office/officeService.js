(function() {
    'use strict';

    angular
        .module('openeApp.office')
        .factory('officeService', officeService);

    officeService.$inject = ['$http'];

    function officeService($http) {
        var service = {
            saveEmail: saveEmail
        };
        return service;

        function saveEmail(data) {
            $http.post('/alfresco/service/dk-openesdh-case-email', data).then(function(response) {
                window.alert('OK');
            }, function(error) {
                window.alert('ERROR');
            })
        }
    }
})();
