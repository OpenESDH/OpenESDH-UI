(function(){
    
    angular.module('openeApp.documents').controller('DocumentController',
            DocumentController);
    
    DocumentController.$inject = [ '$scope', '$routeParams', 'caseDocumentsService' ];
    
    function DocumentController($scope, $routeParams, caseDocumentsService) {
    
        var caseId = $routeParams.caseId;
        var vm = this;
        vm.pageSize = 2;
        
        vm.loadDocuments = loadDocuments;
        
        activate();
        
        function activate(){
            loadDocuments(1);
        }
        
        function loadDocuments(page){
            var res = caseDocumentsService.getDocumentsByCaseId(caseId, page, vm.pageSize);
            res.then(function(response) {
                vm.documents = response.documents;
                vm.contentRange = response.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }
    }

})();
