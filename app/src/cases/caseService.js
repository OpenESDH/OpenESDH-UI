
    angular
        .module('openeApp.cases')
        .factory('caseService', caseService);

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
            printCase: printCase,
            getCaseDocumentsFolderNodeRef: getCaseDocumentsFolderNodeRef,
            getGroupCases: getGroupCases,
            getCasesGeneral: getCasesGeneral
        };
        return service;

        function getCaseTypes() {
            return $http.get('/alfresco/service/api/openesdh/casetypes/casecreator').then(function (response) {
                return response.data;
            });
        }

        function getCases(baseType, filters) {
            return this.getCasesGeneral('/alfresco/s/api/openesdh/search', baseType, filters);
        }
        
        function getGroupCases(baseType, filters) {
            return this.getCasesGeneral('/alfresco/s/api/openesdh/group/cases/search', baseType, filters);
        }
        
        function getCasesGeneral(url, baseType, filters){
            var params = {
                baseType: baseType,
                sortBy: "-cm:modified"
            };            
            if(filters != null && filters != undefined){
                params.filters = filters;
            }
            return $http.get(url, {params: params}).then(function (reponse) {
                return response.data;
            });
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
        function createCase(type, props) {
            return userService.getHome().then(function (response) {
                props.alf_destination = response.nodeRef;
                return $http.post('/alfresco/service/api/type/' + type + '/formprocessor', props).then(function (response) {
                    var nodeRef = response.data.persistedObject;
                    return $http.get('/alfresco/service/api/openesdh/documents/isCaseDoc/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
                        return response.data.caseId;
                    });
                });
            });
        }
        
        function updateCase(nodeRef, props){
            return $http.post('/alfresco/service/api/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/formprocessor', props).then(function (response) {
                return response.data;
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