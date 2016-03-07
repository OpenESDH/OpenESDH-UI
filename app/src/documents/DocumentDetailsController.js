
angular
        .module('openeApp.documents')
        .controller('DocumentDetailsController', DocumentDetailsController);

function DocumentDetailsController($stateParams, $translate, $mdDialog, $location, caseDocumentDetailsService,
        documentPreviewService, caseDocumentFileDialogService, notificationUtilsService,
        alfrescoDownloadService, alfrescoFolderService, sessionService, fileUtilsService) {
    
    var vm = this;
    vm.documentNodeRef = $stateParams.storeType + "://" + $stateParams.storeId + "/" + $stateParams.id;
    vm.caseDocument = null;
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
    vm.getAttachment = getAttachment;
    vm.refreshDocumentPreview = loadDocumentPreview;
    vm.refreshDocumentView = refreshDocumentView;
    vm.editOnlineDocument = editOnlineDocument;
    vm.editOnlineAttachment = editOnlineAttachment;
    vm.canEditOnlineDocument = false;
    vm.canEditOnlineAttachment = canEditOnlineAttachment;
    vm.canEditOnline = canEditOnline;
    vm.editOnline = editOnline;
    vm.isCaseDocVersionEditable = isCaseDocVersionEditable;
    vm.activate = activate;
    vm.loadCaseDocumentInfo = loadCaseDocumentInfo;
    vm.loadCaseDocument = loadCaseDocument;
    vm.loadVersionDetails = loadVersionDetails;
    vm.refreshDocumentView = refreshDocumentView;
    vm.afterDocumentDelete = afterDocumentDelete;
    vm.loadDocumentPreview = loadDocumentPreview;
    vm.initDocPreviewController = initDocPreviewController;
    
    function activate() {
        this.initDocPreviewController();
        this.loadCaseDocumentInfo();
    }

    function loadCaseDocumentInfo() {
        var vm = this;
        return vm.loadCaseDocument().then(function(document) {
            vm.loadVersionDetails().then(function(){
                vm.refreshDocumentView();
            });
        });
    }
    
    function loadCaseDocument(){
        var vm = this;
        return caseDocumentDetailsService.getCaseDocument(vm.documentNodeRef).then(function(document) {
            vm.caseDocument = document;
            vm.doc = document;
            return document;
        });
    }

    function loadVersionDetails() {
        var vm = this;
        return caseDocumentDetailsService.getDocumentVersionInfo(vm.caseDocument.mainDocNodeRef).then(function(versions) {
            vm.documentVersions = versions;
            vm.docVersion = versions[0];
            vm.canEditOnlineDocument = vm.canEditOnline(versions[0].name);
        });
    }
    
    function refreshDocumentView(){
        this.loadDocumentPreview();
        this.loadAttachments();
    }
    
    function initDocPreviewController() {
        var vm = this;
        vm.docPreviewController = DocPreviewController;
            
        function DocPreviewController($scope){
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
        };
    }
    
    function loadDocumentPreview() {
        var vm = this;
        var nodeRef = vm.caseDocument.mainDocNodeRef;
        if(vm.documentVersions[0].nodeRef != vm.docVersion.nodeRef){
            nodeRef = vm.docVersion.nodeRef;
        }
        documentPreviewService.previewDocumentPlugin(nodeRef).then(function(plugin) {
            vm.docPreviewControllerObj.setPreviewPlugin(plugin);
        });
    }

    function loadAttachments(page) {
        if (!page) {
            page = 1;
        }
        var vm = this;
        return caseDocumentDetailsService.getDocumentAttachments(vm.docVersion.nodeRef, page, vm.pageSize).then(function(attachments) {
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
        var vm = this;
        caseDocumentDetailsService.downloadDocument(vm.docVersion);
    }

    function previewDocument() {
        var vm = this;
        documentPreviewService.previewDocument(vm.caseDocument.mainDocNodeRef);
    }

    function uploadDocNewVersion() {
        var vm = this;
        vm.loadCaseDocument().then(function(){
            if(vm.doc.editLockState.isLocked){
                return;
            }
            caseDocumentFileDialogService.uploadCaseDocumentNewVersion(vm.documentNodeRef).then(function(result) {
                vm.loadCaseDocumentInfo();
                setTimeout(loadDocumentPreview, 500);
            });
        });
    }

    function uploadAttachment() {
        var vm = this;
        caseDocumentFileDialogService.uploadAttachment(vm.documentNodeRef).then(function(result) {
            vm.loadCaseDocumentInfo();
        });
    }

    function uploadAttachmentNewVersion(attachment) {
        var vm = this;
        vm.loadAttachments().then(function(){
            var currAttachment = vm.getAttachment(attachment.nodeRef);            
            if(currAttachment == null || currAttachment.locked){
                return;
            }
            caseDocumentFileDialogService.uploadAttachmentNewVersion(attachment.nodeRef).then(function(result) {
                vm.loadAttachments();
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
        var vm = this;
        caseDocumentFileDialogService.editDocumentProperties(vm.documentNodeRef).then(function(result) {
            vm.loadCaseDocumentInfo();
        });
    }
    
    function canEditOnlineAttachment(attachment){        
        return !attachment.locked && this.canEditOnline(attachment.name);
    }
    
    function canEditOnline(documentName){
        var msprotocol = fileUtilsService.getMsProtocolForFile(documentName);
        return msprotocol != undefined && msprotocol != null;
    }
    
    function editOnlineDocument(){
        var vm = this;
        vm.loadCaseDocument().then(function(){
            if(vm.doc.isLocked){
                return;
            }
            vm.editOnline(vm.documentVersions[0].name);
        });
    }
    
    function editOnlineAttachment(attachment){
        var vm = this;
        vm.loadAttachments().then(function(){
            var currAttachment = vm.getAttachment(attachment.nodeRef);            
            if(currAttachment == null || currAttachment.locked){
                return;
            }
            vm.editOnline(attachment.name);
        });
    }
    
    function getAttachment(nodeRef){
        var vm = this;
        for(var i in vm.attachments){
            var attach = vm.attachments[i];
            if(attach.nodeRef == nodeRef){
                return attach;
            }
        }
        return null;
    }
    
    function editOnline(documentName){
        var vm = this;
        caseDocumentDetailsService.editOnlineDocument(vm.caseDocument.editOnlinePath + "/" + documentName);
        setTimeout(function(){
            vm.loadCaseDocumentInfo();
        }, 2000);
    }
    
    function isCaseDocVersionEditable(){
        var vm = this;
        if(!vm.documentVersions){
            return false;
        }
        return vm.documentVersions[0].nodeRef == vm.docVersion.nodeRef;
    }

    function changeDocumentStatus(status) {
        var vm = this;
        caseDocumentDetailsService.changeDocumentStatus(vm.documentNodeRef, status).then(function(json) {
            vm.loadCaseDocumentInfo();
            notificationUtilsService.notify($translate.instant("DOCUMENT.STATUS_CHANGED_SUCCESS"));
        }, function(response) {
            notificationUtilsService.alert(response.data.message);
        });
    }

    function deleteDocument() {
        var vm = this;
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT', {document_title: vm.doc["title"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            alfrescoFolderService.deleteFolder(vm.documentNodeRef).then(function(result) {
                notificationUtilsService.notify($translate.instant('DOCUMENT.DELETE_DOC_SUCCESS'));
                vm.afterDocumentDelete();
            }, function(result) {
                console.log(result);
                notificationUtilsService.alert($translate.instant('DOCUMENT.DELETE_DOC_FAILURE'));
            });
        });
    }

    function afterDocumentDelete(){
        $location.path("/");
    }
}