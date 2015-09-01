(function(){
    
    angular
        .module('openeApp.documents')
        .controller('DocumentDetailsController', DocumentDetailsController);
    
    DocumentDetailsController.$inject = [ '$scope', '$routeParams', '$mdDialog', 'caseDocumentDetailsService' ];
    
    function DocumentDetailsController($scope, $routeParams, $mdDialog, caseDocumentDetailsService) {
        
        var caseId = $routeParams.caseId;
        var storeType = $routeParams.storeType;
        var storeId = $routeParams.storeId;
        var docId = $routeParams.id;
        var caseDocument = null;
        var documentVersions = [];
        
        var vm = this;
        
        activate();
        
        function activate(){
            loadCaseDocumentInfo();
        }
        
        function loadCaseDocumentInfo(){
            caseDocumentDetailsService.getCaseDocument(storeType, storeId, docId).then(function(document){
                caseDocument = document;                
                vm.doc = document;
                loadVersionDetails();
            });
        }
        
        function loadVersionDetails(){
            caseDocumentDetailsService.getDocumentVersionInfo(caseDocument.mainDocNodeRef).then(function(versions){
                documentVersions = versions;
                vm.documentVersions = versions;
                vm.docVersion = versions[0];
            });
        }
    }

})();