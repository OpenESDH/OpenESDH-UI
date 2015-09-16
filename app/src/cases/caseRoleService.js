(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .factory('caseRoleService', caseRoleService);

    caseRoleService.$inject = ['$http', '$q'];

    function caseRoleService($http, $q) {
        var service = {
            getCaseRoles: getCaseRoles
        };
        return service;

        function getCaseRoles(caseId) {
            return $http.get('/alfresco/service/api/openesdh/'+caseId+'/caseroles').then(successOrReject);
        }
        
        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }

})();
