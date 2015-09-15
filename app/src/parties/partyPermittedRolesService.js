(function() {
    'use strict';

    angular
            .module('openeApp.cases.parties')
            .factory('partyPermittedRolesService', PartyPermittedRolesService);

    PartyPermittedRolesService.$inject = ['$http', '$q'];

    function PartyPermittedRolesService($http, $q) {
        var service = {
            getRoles: getRoles
        };
        return service;

        function getRoles() {
            return $http.get("/alfresco/service/api/openesdh/case/party/permittedRoles")
                    .then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }
})();