
angular
        .module('openeApp.documents')
        .controller('DocumentAttachmentsController', DocumentAttachmentsController);

function DocumentAttachmentsController($scope, caseDocumentDetailsService, caseDocumentFileDialogService,
        documentPreviewService, sharePointProtocolService) {
    var vm = this;
    vm.documentNodeRef = null;
    vm.isDocumentEditable = false;
    vm.docVersionNodeRef = null;
    vm.attachments = [];
    vm.page = 1;
    vm.pageSize = 100;

    vm.init = init;
    
    vm.editOnlineAttachment = editOnlineAttachment;
    
    vm.uploadAttachment = uploadAttachment;
    vm.uploadAttachmentNewVersion = uploadAttachmentNewVersion;
    vm.downloadAttachment = downloadAttachment;
    vm.previewAttachment = previewAttachment;
    vm.getAttachment = getAttachment;
    vm.canEditOnlineAttachment = canEditOnlineAttachment;

    function init(v_versionNodeRef, v_documentNodeRef, v_isDocumentEditable) {
        $scope.$watch('$parent.' + v_versionNodeRef, function(newVal, oldVal) {
            vm.attachments = [];
            if (newVal) {
                vm.docVersionNodeRef = newVal.nodeRef;
                vm.documentNodeRef = null;
                vm.isDocumentEditable = false;
                loadAttachments();
            }
        });
        $scope.$watch('$parent.' + v_documentNodeRef, function(newVal, oldVal) {
            if (newVal) {
                vm.docVersionNodeRef = newVal;
            }
        });
        $scope.$watch('$parent.' + v_isDocumentEditable, function(newVal, oldVal) {
            if (typeof newVal !== undefined) {
                vm.isDocumentEditable = newVal;
            }
        });
    }
    
    function loadAttachments() {
        return caseDocumentDetailsService.getDocumentAttachments(vm.docVersionNodeRef, vm.page, vm.pageSize).then(function(attachments) {
            vm.attachments = attachments.resultList;
            vm.attachmentsContentRange = attachments.contentRange;
            var pages = [];
            var pagesCount = Math.ceil(attachments.contentRange.totalItems / vm.pageSize);
            for (var i = 0; i < pagesCount; i++) {
                pages.push(i + 1);
            }
            vm.attachmentsPages = pages;
        });
    }

    function uploadAttachment() {
        caseDocumentFileDialogService.uploadAttachment(vm.getDocumentNodeRef()).then(function(result) {
            vm.loadCaseDocumentInfo();
        });
    }

    function uploadAttachmentNewVersion(attachment) {
        loadAttachments().then(function() {
            var currAttachment = vm.getAttachment(attachment.nodeRef);
            if (currAttachment === null || currAttachment.locked) {
                return;
            }
            caseDocumentFileDialogService.uploadAttachmentNewVersion(attachment.nodeRef).then(function(result) {
                loadAttachments();
            });
        });
    }

    function downloadAttachment(attachment) {
        caseDocumentDetailsService.downloadAttachment(attachment);
    }

    function previewAttachment(attachment) {
        documentPreviewService.previewDocument(attachment.nodeRef);
    }

    function canEditOnlineAttachment(attachment) {
        return !attachment.locked && sharePointProtocolService.canEditOnline(attachment.name);
    }

    function editOnlineAttachment(attachment) {
        loadAttachments().then(function() {
            var currAttachment = getAttachment(attachment.nodeRef);
            if (currAttachment == null || currAttachment.locked) {
                return;
            }
            sharePointProtocolService.editOnline(attachment.name);
        });
    }

    function getAttachment(nodeRef) {
        for (var i in vm.attachments) {
            var attach = vm.attachments[i];
            if (attach.nodeRef == nodeRef) {
                return attach;
            }
        }
        return null;
    }
    
    function _extractFromParent(varName){
        var result = $scope.$parent;
        var variables = varName.split('.');
        for (var i = 0; i < variables.length; i++){
            if (!variables[i]) {
                return;
            }
            result = result[variables[i]];
        }
        return result;
    }
}