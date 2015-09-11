(function(){
    
    angular
        .module('openeApp.documents')
        .controller('DocumentController', DocumentController);
    
    DocumentController.$inject = [ '$scope', '$stateParams', 'caseDocumentsService', 'documentPreviewService', 'caseDocumentFileDialogService' ];
    
    function DocumentController($scope, $stateParams, caseDocumentsService, documentPreviewService, caseDocumentFileDialogService) {
    
        var caseId = $stateParams.caseId;
        var vm = this;
        vm.caseId = caseId;
        vm.pageSize = 2;
        
        vm.loadDocuments = loadDocuments;
        vm.uploadDocument = uploadDocument;
        vm.previewDocument = previewDocument;
        
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
        
        function uploadDocument(){
            caseDocumentFileDialogService.uploadCaseDocument(caseId).then(function(result){
                loadDocuments(1); 
            });
        }
        
        function previewDocument(nodeRef){
            documentPreviewService.previewDocument(nodeRef);
        }
    }

})();
