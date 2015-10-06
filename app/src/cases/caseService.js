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
            updateCase: updateCase,
            getCaseInfo: getCaseInfo,
            changeCaseStatus: changeCaseStatus,
            sendEmail: sendEmail,
            printCase: printCase
        };
        return service;

        function getCaseTypes() {
            return $http.get('/alfresco/service/api/openesdh/casetypes/casecreator').then(getCaseTypesComplete);

            function getCaseTypesComplete(response) {
                return response.data;
            }
        }

        function getCases(baseType, filters) {
            var params = {
                baseType: baseType 
            };
            if(filters != null && filters != undefined){
                params.filters = filters;
            }
            return $http.get('/alfresco/service/api/openesdh/search?sortBy=-cm:modified', {params: params}).then(getCasesComplete, getCasesFailed);

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
            var params = getCaseParams(caseData);
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
        
        function updateCase(caseData, oldCaseData){
            var params = getCaseParams(caseData, oldCaseData);
            
            return $http.post('/alfresco/service/api/node/' + alfrescoNodeUtils.processNodeRef(caseData.nodeRef).uri + '/formprocessor', params).then(function (response) {
                return response.data;
            });
        }
        
        function getCaseParams(caseData, oldCaseData){
            var params = {
                prop_cm_title: caseData.title,
                prop_cm_description: caseData.description,
                prop_base_startDate: caseData.startDate,
                prop_base_endDate: caseData.endDate,
                prop_oe_journalKey: caseData.journalKey,
                prop_oe_journalFacet: caseData.journalFacet
            };
            
            if(oldCaseData == null || oldCaseData == undefined){
                params.assoc_base_owners_added = caseData.owner;
            }else if(caseData.owner != oldCaseData.owner){
                params.assoc_base_owners_added = caseData.owner; 
                params.assoc_base_owners_removed = oldCaseData.owner;
            }
            return params;
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
            return $http.post('/alfresco/service/api/openesdh/case/' + caseId + '/email', message).then(function (response) {
                return response.data;
            });
        }
        
        function printCase(caseId, printInfo){
            return $http.post('/alfresco/s/api/openesdh/case/' + caseId + '/print', printInfo,  {responseType: 'arraybuffer'}).then(function(response){
                return response.data;
            });
        }
    }
})();
