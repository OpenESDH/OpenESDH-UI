
angular
        .module('openeApp.documents')
        .controller('DocumentAttachmentsController', DocumentAttachmentsController);

function DocumentAttachmentsController($scope, $injector, $state, $stateParams, caseDocumentDetailsService,
        caseDocumentFileDialogService, documentPreviewService, sharePointProtocolService, 
        documentAttachmentEditActionsService, notificationUtilsService) {
    var vm = this;
    vm.documentNodeRef = null;
    vm.isDocumentEditable = false;
    vm.docVersionNodeRef = null;
    vm.attachments = [];
    vm.page = 1;
    vm.pageSize = 100;
    vm.editActionItems = documentAttachmentEditActionsService.getActionItems();
    vm.executeEditAction = executeEditAction;

    vm.init = init;

    vm.uploadAttachment = uploadAttachment;
    vm.uploadAttachmentNewVersion = uploadAttachmentNewVersion;
    vm.downloadAttachment = downloadAttachment;
    vm.previewAttachment = previewAttachment;

    function init(v_versionNodeRef, v_documentNodeRef, v_isDocumentEditable) {
        $scope.$watch('$parent.' + v_versionNodeRef, function(newVal, oldVal) {
            vm.attachments = [];
            if (newVal) {
                vm.docVersionNodeRef = newVal.nodeRef;
                vm.isDocumentEditable = false;
                loadAttachments();
            }
        });
        $scope.$watch('$parent.' + v_documentNodeRef, function(newVal, oldVal) {
            if (newVal) {
                vm.documentNodeRef = newVal;
            }
        });
        $scope.$watch('$parent.' + v_isDocumentEditable, function(newVal, oldVal) {
            if (typeof newVal !== "undefined") {
                vm.isDocumentEditable = newVal;
            }
        });
    }

    function loadAttachments() {
        return caseDocumentDetailsService.getDocumentAttachments(vm.docVersionNodeRef, vm.page, vm.pageSize).then(function(attachments) {
            vm.attachments = attachments.resultList.map(function(attachment) {
                attachment.canBeEditedOnline = sharePointProtocolService.canEditOnline(attachment.name);
                return attachment;
            });
            vm.attachmentsContentRange = attachments.contentRange;
            var pages = [];
            var pagesCount = Math.ceil(attachments.contentRange.totalItems / vm.pageSize);
            for (var i = 0; i < pagesCount; i++) {
                pages.push(i + 1);
            }
            vm.attachmentsPages = pages;
        });
    }

    function refresh() {
        $state.go('docDetails', $stateParams, {reload: true});
    }

    function uploadAttachment() {
        caseDocumentFileDialogService.uploadAttachment(vm.documentNodeRef).then(function(result) {
            refresh();
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

    function executeEditAction(attachment, actionItem) {
        var service = $injector.get(actionItem.serviceName);
        service.executeDocAttachmentAction(attachment, loadAttachments, showError, $scope);
    }

    function showError(error) {
        if (error) {
            console.log(error);
            notificationUtilsService.alert(error.message || error.data.message || error.statusText);
        }
    }
}