
    angular
        .module('openeApp.cases')
        .factory('caseService', caseService);

    function caseService($http, userService, alfrescoNodeUtils, formProcessorService) {
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
            getCasesGeneral: getCasesGeneral,
            caseSearch: caseSearch
        };
        return service;

        function getCaseTypes() {
            return $http.get('/api/openesdh/casetypes/casecreator').then(function (response) {
                return response.data;
            });
        }
        
        function caseSearch(query) {
            var q = '*' + query + '*';
            var filters = [
                {'name': 'oe:id', 'operator':'=', 'value':q},
                {'name': 'cm:title', 'operator': '=', 'value': q}
            ];
            return getCasesGeneral('/api/openesdh/search', 'base:case', filters, 'OR');
        }

        function getCases(baseType, filters, filterType) {
            return this.getCasesGeneral('/api/openesdh/search', baseType, filters, filterType);
        }
        
        function getGroupCases(baseType, filters) {
            return this.getCasesGeneral('/api/openesdh/group/cases/search', baseType, filters);
        }
        
        function getCasesGeneral(url, baseType, filters, filterType){
            var params = {
                baseType: baseType,
                sortBy: "-cm:modified"
            };            
            if(filters != null && filters != undefined){
                params.filters = filters;
                params.filterType = filterType; // 'AND'/'OR'
            }
            return $http.get(url, {params: params}).then(function (response) {
                return response.data;
            });
        }

        function getMyCases(baseType) {
            return $http.get('/api/openesdh/userinvolvedsearch', {}).then(getCasesComplete, getCasesFailed);

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
                return formProcessorService.createNode(type, props).then(function(nodeRef){
                    return $http.get('/api/openesdh/documents/isCaseDoc/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function (response) {
                        return response.data.caseId;
                    });
                });
            });
        }
        
        function updateCase(nodeRef, props){
            return formProcessorService.updateNode(nodeRef, props);
        }
        
        function getCaseInfo(caseId) {
            return $http.get('/api/openesdh/caseinfo/' + caseId).then(getCaseInfoComplete);

            function getCaseInfoComplete(response) {
                return response.data;
            }
        }

        function getCaseDocumentsFolderNodeRef(caseId) {
            return $http.get('/api/openesdh/case/docfolder/noderef/' + caseId).then(function (response) {
                return response.data;
            });
        }

        function changeCaseStatus(caseId, status) {
            return $http.post('/api/openesdh/case/' + caseId + '/status', {status: status}).then(function (response) {
                return response.data;
            });
        }

        function sendEmail(caseId, message) {
            return $http.post('/api/openesdh/case/' + caseId + '/email', message).then(function (response) {
                return response.data;
            });
        }
        
        function printCase(caseId, printInfo){
            return $http.post('/api/openesdh/case/' + caseId + '/print', printInfo,  {responseType: 'arraybuffer'}).then(function(response){
                return response.data;
            });
        }
    }