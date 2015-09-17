(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .factory('caseService', caseService);

    caseService.$inject = ['$http', 'userService', 'alfrescoNodeUtils'];

    function caseService($http, userService, alfrescoNodeUtils) {
        var service = {
            getCaseTypes: getCaseTypes,
            getCases: getCases,
            getMyCases: getMyCases,
            createCase: createCase,
            getCaseInfo: getCaseInfo,
            changeCaseStatus: changeCaseStatus,
            sendEmail: sendEmail
        };
        return service;

        function getCaseTypes() {
            return $http.get('/alfresco/service/api/openesdh/casetypes/casecreator').then(getCaseTypesComplete);

            function getCaseTypesComplete(response) {
                return response.data;
            }
        }

        function getCases(baseType) {
            return $http.get('/alfresco/service/api/openesdh/search', {params: {baseType: baseType}}).then(getCasesComplete, getCasesFailed);

            function getCasesComplete(response) {
                return response.data;
            }

            function getCasesFailed(error) {
            }
        }

        function getMyCases(baseType) {
            return $http.get('/alfresco/service/api/openesdh/userinvolvedsearch', {}).then(getCasesComplete, getCasesFailed);

            function getCasesComplete(response) {
                return response.data;
            }

            function getCasesFailed(error) {
            }
        }

        /**
         * Returns the id of the created case as a Promise.
         * @param caseData
         * @returns {*}
         */
        function createCase(caseData) {
            var params = {
                prop_cm_title: caseData.title,
                prop_cm_description: caseData.description,
                assoc_base_owners_added: caseData.owner,
                prop_base_startDate: caseData.startDate,
                prop_base_endDate: caseData.endDate,
                prop_oe_journalKey: caseData.journalKey,
                prop_oe_journalFacet: caseData.journalFacet
            };
            var type = 'simple:case';
            return userService.getHome().then(function (response) {
                params.alf_destination = response.nodeRef;
                return $http.post('/alfresco/service/api/type/' + type + '/formprocessor', params).then(function (response) {
                    var nodeRef = response.data.persistedObject;
                    return $http.get('/alfresco/service/api/openesdh/documents/isCaseDoc/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
                        return response.data.caseId;
                    });
                });
            });
        }

        function getCaseInfo(caseId) {
            return $http.get('/alfresco/service/api/openesdh/caseinfo/' + caseId).then(getCaseInfoComplete);

            function getCaseInfoComplete(response) {
                return response.data;
            }
        }

        function getCaseDocumentsFolderNodeRef(caseId) {
            return $http.get('/alfresco/service/api/openesdh/case/docfolder/noderef/' + caseId).then(function (response) {
                return response.data;
            });
        }

        function changeCaseStatus(caseId, status) {
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/status', {status: status}).then(function (response) {
                return response.data;
            });
        }

        function sendEmail(caseId, message) {
            console.log(message);
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/email', message).then(function (response) {
                return response.data;
            });
        }
    }
})();
