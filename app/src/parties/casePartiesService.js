
    angular
            .module('openeApp.cases.parties')
            .factory('casePartiesService', CasePartiesService);

    function CasePartiesService($http, $q) {
        var service = {
            getCaseParties: getCaseParties,
            createCaseParty: createCaseParty,
            changeCaseParty: changeCaseParty,
            deleteCaseParty: deleteCaseParty
        };
        return service;

        function getCaseParties(caseId) {
            return $http.get('/alfresco/service/api/openesdh/case/' + caseId + '/parties')
                    .then(successOrReject);
        }

        function createCaseParty(caseId, role, contacts) {
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/party/' + role, {contactNodeRefs: contacts})
                    .then(successOrReject);
        }

        function changeCaseParty(caseId, nodeRefId, oldRole, newRole) {
            return $http.put('/alfresco/service/api/openesdh/case/' + caseId + '/party',
                    {
                        partyId: nodeRefId,
                        oldRole: oldRole,
                        newRole: newRole
                    }).then(successOrReject);
        }

        function deleteCaseParty(caseId, party) {
            return $http.delete('/alfresco/service/api/openesdh/case/' + caseId + '/party/' + party.role, {params: {partyId: party.nodeRef}})
                    .then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }