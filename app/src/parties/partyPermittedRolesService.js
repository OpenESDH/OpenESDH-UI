
    angular
        .module('openeApp.cases.parties')
        .factory('partyPermittedRolesService', PartyPermittedRolesService);

    function PartyPermittedRolesService($http, $q) {
        var service = {
            getRoles: getRoles
        };
        return service;

        function getRoles() {
            return $http.get("/api/openesdh/case/party/permittedRoles")
                    .then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }