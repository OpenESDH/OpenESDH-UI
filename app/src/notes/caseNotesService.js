
    angular
        .module('openeApp.notes')
        .factory('caseNotesService', CaseNotesService);

    function CaseNotesService($http, httpUtils) {
        
        var DEFAULT_NOTES_PAGE_SIZE = 6;

        var service = {
            getCaseNotes: getCaseNotes,
            addNewNote: addNewNote,
            createPagingParams: createPagingParams
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
            return "/api/openesdh/case/" + caseId + "/notes";
        }
        
        function createPagingParams(){
            return {
                page: 1,
                pageSize: DEFAULT_NOTES_PAGE_SIZE,
                totalRecords: 0,
                
                getStartIndex: function() {
                    return (this.page - 1) * this.pageSize + 1;
                },
                getEndIndex: function() {
                    var lastIndex = this.page * this.pageSize;
                    return lastIndex < this.totalRecords ? lastIndex : this.totalRecords;
                },
                hasPreviousPage: function() {
                    return this.page > 1;
                },
                hasNextPage: function() {
                    return this.getEndIndex() < this.totalRecords;
                }
            };
        }
    }