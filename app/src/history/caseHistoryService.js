
    angular
        .module('openeApp.cases')
        .factory('caseHistoryService', caseHistoryService);

    function caseHistoryService($http, httpUtils) {
        var service = {
            getCaseHistory: getCaseHistory
        };
        return service;

        function getCaseHistory(caseId, page, pageSize) {
            var requestConfig = {
                url: '/api/openesdh/case/' + caseId + '/history',
                method: "GET"
            };
            
            httpUtils.setXrangeHeader(requestConfig, page, pageSize);
            
            return $http(requestConfig).then(function(response){
                return {
                    history: response.data, 
                    contentRange: httpUtils.parseResponseContentRange(response)
                };
            });
        }
    }
