
    angular
            .module('openeApp.cases.parties')
            .factory('casePartiesService', CasePartiesService);

    function CasePartiesService($http, $q, alfrescoNodeUtils) {
        var service = {
            getCaseParties: getCaseParties,
            createCaseParty: createCaseParty,
            changeCaseParty: changeCaseParty,
            deleteCaseParty: deleteCaseParty
        };
        return service;

        function getCaseParties(caseId) {
            return $http.get('/api/openesdh/case/' + caseId + '/parties')
                    .then(successOrReject);
        }

        function createCaseParty(caseId, role, contacts) {
            return $http.post('/api/openesdh/case/' + caseId + '/party', {roleRef: role, contactIds: contacts})
                    .then(successOrReject);
        }

        function changeCaseParty(caseId, partyNodeRef, roleRef) {
            return $http.put('/api/openesdh/case/' + caseId + '/party',
                    {
                        nodeRef: partyNodeRef,
                        roleRef: roleRef
                    }).then(successOrReject);
        }

        function deleteCaseParty(caseId, partyRef) {
            return $http.delete('/api/openesdh/case/' + caseId + '/party/' + alfrescoNodeUtils.processNodeRef(partyRef).uri)
                    .then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data;
        }
    }