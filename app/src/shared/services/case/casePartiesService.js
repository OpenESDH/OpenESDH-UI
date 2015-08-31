(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('casePartiesService', CasePartiesService);

    CasePartiesService.$inject = ['$http'];

    function CasePartiesService($http) {
        var service = {
                getCaseParties: getCaseParties
        };
        return service;

        function getCaseParties(caseId) {
            return $http({
                        url: "/alfresco/service/api/openesdh/case/" + caseId + "/parties",
                        method: "GET"
            }).then(function(response){
                return {
                    parties: response.data 
                };
            });
        }
    }
})();