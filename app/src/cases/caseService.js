(function() {
    'use strict';

    angular
        .module('cases')
        .factory('caseService', caseService);

    caseService.$inject = ['$http', '$resource'];

    function caseService($http, $resource) {
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

        function createCase(params) {
            return $resource('/alfresco/service/api/type/:type/formprocessor', {type: 'simple:case'}).save(params, createCaseComplete);

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
    }
})();
