(function() {
    'use strict';

    angular
            .module('openeApp.cases.members')
            .factory('caseMembersService', caseMembersService);

    caseMembersService.$inject = ['$http', '$q'];

    function caseMembersService($http, $q) {
        var service = {
            getCaseMembers: getCaseMembers,
            createCaseMembers: createCaseMembers,
            changeCaseMember: changeCaseMember,
            deleteCaseMember: deleteCaseMember
        };
        return service;

        function getCaseMembers(caseId) {
            return $http.get('/alfresco/service/api/openesdh/case/' + caseId + '/members')
                    .then(successOrReject);
        }

        function createCaseMembers(caseId, role, authorities) {
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/members', null,
                    {
                        params: {
                            authorityNodeRefs: authorities,
                            role: role
                        }
                    }).then(successOrReject);
        }

        function changeCaseMember(caseId, authority, oldRole, newRole) {
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/members', null,
                    {
                        params: {
                            authority: authority,
                            role: newRole,
                            fromRole: oldRole
                        }
                    }).then(successOrReject);
        }

        function deleteCaseMember(caseId, authority, role) {
            return $http.delete('/alfresco/service/api/openesdh/case/' + caseId + '/member',
                    {params: {
                            authority: authority,
                            role: role
                        }}).then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }
})();