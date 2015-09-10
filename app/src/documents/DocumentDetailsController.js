(function(){
    
    angular
        .module('openeApp.documents')
        .controller('DocumentDetailsController', DocumentDetailsController);
    
    DocumentDetailsController.$inject = [ '$scope', '$stateParams', '$mdDialog', 'caseDocumentDetailsService', 'documentPreviewService' ];
    
    function DocumentDetailsController($scope, $stateParams, $mdDialog, caseDocumentDetailsService, documentPreviewService) {
        
        var caseId = $stateParams.caseId;
        var documentNodeRef = $stateParams.storeType + "://" + $stateParams.storeId + "/" + $stateParams.id;
        var caseDocument = null;
        var documentVersions = [];
        
        var vm = this;
        vm.caseId = caseId;
        vm.pageSize = 2;
        
        vm.uploadDocNewVersion = uploadDocNewVersion;
        vm.downloadDocument = downloadDocument;
        vm.uploadAttachment = uploadAttachment;
        vm.loadAttachments = loadAttachments;
        vm.uploadAttachmentNewVersion = uploadAttachmentNewVersion;
        vm.downloadAttachment = downloadAttachment;
        vm.previewDocument = previewDocument;
        vm.previewAttachment = previewAttachment;
        
        activate();
        
        function activate(){
            loadCaseDocumentInfo();
        }
        
        function loadCaseDocumentInfo(){
            caseDocumentDetailsService.getCaseDocument(documentNodeRef).then(function(document){
                caseDocument = document;                
                vm.doc = document;
                loadVersionDetails();
                loadAttachments();
            });
        }
        
        function loadVersionDetails(){
            caseDocumentDetailsService.getDocumentVersionInfo(caseDocument.mainDocNodeRef).then(function(versions){
                documentVersions = versions;
                vm.documentVersions = versions;
                vm.docVersion = versions[0];
            });
        }
        
        function loadAttachments(page){
            if(!page){
                page = 1;
            }
            caseDocumentDetailsService.getDocumentAttachments(documentNodeRef, page, vm.pageSize).then(function(attachments){
                vm.attachments = attachments.resultList;
                vm.attachmentsContentRange = attachments.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(attachments.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.attachmentsPages = pages;
            });
        }
        
        function downloadDocument(){
            caseDocumentDetailsService.downloadDocument(vm.docVersion);
        }
        
        function previewDocument(){
            documentPreviewService.previewDocument(vm.docVersion.nodeRef);
        }
        
        function uploadDocNewVersion(){
            uploadDialog().then(function(fileToUpload) {
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
        
        function uploadAttachment(){
            uploadDialog().then(function(fileToUpload) {
                if(!fileToUpload){
                    return;
                }
                caseDocumentDetailsService.uploadDocumentAttachment(documentNodeRef, fileToUpload).then(function(result){
                   loadAttachments(); 
                });
            }, function() {
                //on cancel dialog
            });
        }
        
        function uploadAttachmentNewVersion(attachment){
            uploadDialog().then(function(fileToUpload) {
                if(!fileToUpload){
                    return;
                }
                caseDocumentDetailsService.uploadAttachmentNewVersion(attachment.nodeRef, fileToUpload).then(function(result){
                   loadAttachments(); 
                });
            }, function() {
                //on cancel dialog
            });
        }
        
        function downloadAttachment(attachment){
            caseDocumentDetailsService.downloadAttachment(attachment);
        }
        
        function uploadDialog(){
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/documents/view/documentUploadDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose:true
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
        
        function previewAttachment(attachment){
            documentPreviewService.previewDocument(attachment.nodeRef);
        }
    }

})();