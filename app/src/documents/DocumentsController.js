angular
        .module('openeApp.documents')
        .controller('DocumentsController', DocumentsController);

function DocumentsController($state, $mdDialog, fileUtilsService, caseDocumentFileDialogService, documentPreviewService) {
    var vm = this;
    vm.uploadDocument = uploadDocument;
    vm.previewDocument = previewDocument;
    vm.noDocuments = noDocuments;
    vm.addThumbnailUrl = addThumbnailUrl;
    vm.reloadDocuments = reloadDocuments;

    function reloadDocuments() {

    }

    function addThumbnailUrl() {
        var vm = this;
        // Mimetype has different paths on caseDocs vs MyDocuments
        var mimeTypeProperty = $state.is('dashboard') ? 'mimetype' : 'fileMimeType';
        vm.documents.forEach(function(document) {
            document.thumbNailURL = fileUtilsService.getFileIconByMimetype(document[mimeTypeProperty], 24);
        });
    }

    function uploadDocument() {
        var vm = this;
        caseDocumentFileDialogService.uploadCaseDocument(vm.docsFolderNodeRef).then(function(result) {
            vm.reloadDocuments();
        });
    }

    function previewDocument(nodeRef) {
        documentPreviewService.previewDocument(nodeRef);
    }

    function noDocuments() {
        var vm = this;
        return typeof vm.documents === 'undefined' || vm.documents.length === 0;
    }
}