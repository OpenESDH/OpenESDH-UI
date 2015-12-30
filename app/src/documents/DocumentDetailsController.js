
angular
        .module('openeApp.documents')
        .controller('DocumentDetailsController', DocumentDetailsController);

function DocumentDetailsController($stateParams, $translate, $mdDialog, $location, caseDocumentDetailsService,
        documentPreviewService, caseDocumentFileDialogService, notificationUtilsService,
        alfrescoDownloadService, alfrescoFolderService, sessionService, fileUtilsService) {

    var caseId = $stateParams.caseId;
    var documentNodeRef = $stateParams.storeType + "://" + $stateParams.storeId + "/" + $stateParams.id;
    var caseDocument = null;
    var documentVersions = [];

    var vm = this;
    vm.caseId = caseId;
    vm.pageSize = 100;
    vm.isAdmin = sessionService.isAdmin();

    vm.uploadDocNewVersion = uploadDocNewVersion;
    vm.downloadDocument = downloadDocument;
    vm.uploadAttachment = uploadAttachment;
    vm.loadAttachments = loadAttachments;
    vm.uploadAttachmentNewVersion = uploadAttachmentNewVersion;
    vm.downloadAttachment = downloadAttachment;
    vm.previewDocument = previewDocument;
    vm.previewAttachment = previewAttachment;
    vm.editDocumentProperties = editDocumentProperties;
    vm.changeDocumentStatus = changeDocumentStatus;
    vm.deleteDocument = deleteDocument;
    vm.docPreviewController = DocPreviewController;
    vm.refreshDocumentPreview = loadDocumentPreview;
    vm.editOnlineDocument = editOnlineDocument;
    vm.editOnlineAttachment = editOnlineAttachment;
    vm.canEditOnlineDocument = false;
    vm.canEditOnlineAttachment = canEditOnlineAttachment;
    activate();

    function activate() {
        loadCaseDocumentInfo();
    }

    function loadCaseDocumentInfo() {
        return loadCaseDocument().then(function(document) {
            loadVersionDetails();
            loadDocumentPreview();
            loadAttachments();
        });
    }
    
    function loadCaseDocument(){
        return caseDocumentDetailsService.getCaseDocument(documentNodeRef).then(function(document) {
            caseDocument = document;
            vm.doc = document;
            return document;
        });
    }

    function loadVersionDetails() {
        caseDocumentDetailsService.getDocumentVersionInfo(caseDocument.mainDocNodeRef).then(function(versions) {
            documentVersions = versions;
            vm.documentVersions = versions;
            vm.docVersion = versions[0];
            vm.canEditOnlineDocument = canEditOnline(versions[0].name);
        });
    }

    function DocPreviewController($scope) {
        vm.docPreviewControllerObj = this;
        this.setPreviewPlugin = function(plugin) {

            $scope.config = plugin;

            $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;

            $scope.download = function() {
                alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
            };

            if (plugin.initScope) {
                plugin.initScope($scope);
            }
        };
    }

    function loadDocumentPreview() {
        documentPreviewService.previewDocumentPlugin(caseDocument.mainDocNodeRef).then(function(plugin) {
            vm.docPreviewControllerObj.setPreviewPlugin(plugin);
        });
    }

    function loadAttachments(page) {
        if (!page) {
            page = 1;
        }
        return caseDocumentDetailsService.getDocumentAttachments(documentNodeRef, page, vm.pageSize).then(function(attachments) {
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

    function downloadDocument() {
        caseDocumentDetailsService.downloadDocument(vm.docVersion);
    }

    function previewDocument() {
        documentPreviewService.previewDocument(caseDocument.mainDocNodeRef);
    }

    function uploadDocNewVersion() {
        loadCaseDocument().then(function(){
            if(vm.doc.editLockState.isLocked){
                return;
            }
            caseDocumentFileDialogService.uploadCaseDocumentNewVersion(documentNodeRef).then(function(result) {
                loadVersionDetails();
                setTimeout(loadDocumentPreview, 500);
            });
        });
    }

    function uploadAttachment() {
        caseDocumentFileDialogService.uploadAttachment(documentNodeRef).then(function(result) {
            loadAttachments();
        });
    }

    function uploadAttachmentNewVersion(attachment) {
        loadAttachments().then(function(){
            var currAttachment = getAttachment(attachment.nodeRef);            
            if(currAttachment == null || currAttachment.locked){
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

    function editDocumentProperties() {
        caseDocumentFileDialogService.editDocumentProperties(documentNodeRef).then(function(result) {
            loadCaseDocumentInfo();
        });
    }
    
    function canEditOnlineAttachment(attachment){
        return !attachment.locked && canEditOnline(attachment.name);
    }
    
    function canEditOnline(documentName){
        var msprotocol = fileUtilsService.getMsProtocolForFile(documentName);
        return msprotocol != undefined && msprotocol != null;
    }
    
    function editOnlineDocument(){
        loadCaseDocument().then(function(){
            if(vm.doc.isLocked){
                return;
            }
            editOnline(vm.documentVersions[0].name);
        });
    }
    
    function editOnlineAttachment(attachment){
        loadAttachments().then(function(){
            var currAttachment = getAttachment(attachment.nodeRef);            
            if(currAttachment == null || currAttachment.locked){
                return;
            }
            editOnline(attachment.name);
        });
    }
    
    function getAttachment(nodeRef){
        for(var i in vm.attachments){
            var attach = vm.attachments[i];
            if(attach.nodeRef == nodeRef){
                return attach;
            }
        }
        return null;
    }
    
    function editOnline(documentName){
        caseDocumentDetailsService.editOnlineDocument(caseDocument.editOnlinePath + "/" + documentName);
        setTimeout(loadCaseDocumentInfo, 2000);
    }

    function changeDocumentStatus(status) {
        caseDocumentDetailsService.changeDocumentStatus(documentNodeRef, status).then(function(json) {
            loadCaseDocumentInfo();
            notificationUtilsService.notify($translate.instant("DOCUMENT.STATUS_CHANGED_SUCCESS"));
        }, function(response) {
            notificationUtilsService.alert(response.data.message);
        });
    }

    function deleteDocument() {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT', {document_title: vm.doc["title"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            alfrescoFolderService.deleteFolder(documentNodeRef).then(function(result) {
                notificationUtilsService.notify($translate.instant('DOCUMENT.DELETE_DOC_SUCCESS'));
                $location.path("/cases/case/" + caseId);
            }, function(result) {
                console.log(result);
                notificationUtilsService.alert($translate.instant('DOCUMENT.DELETE_DOC_FAILURE'));
            });
        });
    }


}