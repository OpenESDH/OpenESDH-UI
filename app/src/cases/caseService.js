(function() {
    'use strict';

    angular
        .module('openeApp.cases')
        .factory('caseService', caseService);

    caseService.$inject = ['$http', '$resource', 'userService'];

    function caseService($http, $resource, userService) {
        var service = {
            getCaseTypes: getCaseTypes,
            getCases: getCases,
            createCase: createCase,
            getCaseInfo: getCaseInfo
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

        function createCase(caseData) {
            var params = {
                prop_cm_title: caseData.title,
                prop_cm_description: caseData.description,
                assoc_base_owners_added: caseData.owner,
                prop_base_startDate: caseData.startDate,
                prop_base_endDate: caseData.endDate
            };
            userService.getHome().then(function(response) {
                params.alf_destination = response.nodeRef;
                return $resource('/alfresco/service/api/type/:type/formprocessor', {type: 'simple:case'}).save(params, createCaseComplete);
            });

            function createCaseComplete(response) {
                return response;
            }
        }

        function getCaseInfo(caseId) {
            return $http.get('/alfresco/service/api/openesdh/caseinfo/' + caseId).then(getCaseInfoComplete);

            function getCaseInfoComplete(response) {
                return response.data;
            }
        }

        function getCaseDocumentsFolderNodeRef(caseId) {
            return $http.get('/alfresco/service/api/openesdh/case/docfolder/noderef/' + caseId).then(function(response) {
                return response.data;
            });
        }
    }
})();
