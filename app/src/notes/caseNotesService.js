(function() {
    'use strict';

    angular
        .module('openeApp.notes')
        .factory('caseNotesService', CaseNotesService);

    CaseNotesService.$inject = ['$http', 'httpUtils'];

    function CaseNotesService($http, httpUtils) {

        var service = {
            getCaseNotes: getCaseNotes,
            addNewNote: addNewNote
        };
        return service;
        
        function getCaseNotes(caseId, page, pageSize) {
            var requestConfig = {
                    url: getNotesUrlForCase(caseId),
                    method: "GET"
            };
            
            httpUtils.setXrangeHeader(requestConfig, page, pageSize);
            
            return $http(requestConfig).then(function(response){
                return {
                    notes: response.data, 
                    contentRange: httpUtils.parseResponseContentRange(response)
                };
            });
        }
        
        function addNewNote(caseId, note){
            var url = getNotesUrlForCase(caseId);
            return $http.post(url, note);
        }
        
        function getNotesUrlForCase(caseId){
            return "/alfresco/service/api/openesdh/case/" + caseId + "/notes";
        }
    }
})();
