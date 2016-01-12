
    angular
        .module('openeApp.cases')
        .factory('caseRoleService', caseRoleService);

    function caseRoleService($http, $q) {
        var service = {
            getCaseRoles: getCaseRoles
        };
        return service;

        function getCaseRoles(caseId) {
            return $http.get('/api/openesdh/'+caseId+'/caseroles').then(successOrReject);
        }
        
        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }
