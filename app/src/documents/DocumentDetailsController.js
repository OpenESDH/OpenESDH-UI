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
        vm.uploadDocNewVersion = uploadDocNewVersion;
        vm.downloadDocument = downloadDocument;
        
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
        
        function downloadDocument(){
            caseDocumentDetailsService.downloadDocument(vm.docVersion);
        }
        
        function uploadDocNewVersion(ev){
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/documents/view/documentUploadDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(fileToUpload) {
                if(!fileToUpload){
                    return;
                }
                caseDocumentDetailsService.uploadDocumentNewVersion(caseDocument.mainDocNodeRef, fileToUpload).then(function(result){
                   loadVersionDetails(); 
                });
            }, function() {
                //on cancel dialog
            });
        }
        
        function DialogController($scope, $mdDialog) {
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.upload = function(){
                $mdDialog.hide($scope.fileToUpload);
            };
        }
    }

})();