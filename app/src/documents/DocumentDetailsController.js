
angular
        .module('openeApp.documents')
        .controller('DocumentDetailsController', DocumentDetailsController);

function DocumentDetailsController($scope, $stateParams, $translate, $mdDialog, $location, caseDocumentDetailsService,
        documentPreviewService, caseDocumentFileDialogService, notificationUtilsService,
        alfrescoDownloadService, alfrescoFolderService, sessionService, sharePointProtocolService,
        documentEditActionsService, $injector) {

    var vm = this;
    vm.documentNodeRef = $stateParams.storeType + "://" + $stateParams.storeId + "/" + $stateParams.id;
    $scope.commentsNodeRef = vm.documentNodeRef; 
    vm.caseDocument = null;
    vm.pageSize = 100;
    vm.isAdmin = sessionService.isAdmin();

    vm.documentEditActions = documentEditActionsService.getActionItems();
    vm.showDocumentEditActions = showDocumentEditActions;
    vm.disableDocumentEditActions = disableDocumentEditActions;
    vm.executeEditAction = executeEditAction;

    vm.uploadDocNewVersion = uploadDocNewVersion;
    vm.downloadDocument = downloadDocument;
    vm.previewDocument = previewDocument;
    vm.editDocumentProperties = editDocumentProperties;
    vm.changeDocumentStatus = changeDocumentStatus;
    vm.deleteDocument = deleteDocument;
    vm.refreshDocumentPreview = loadDocumentPreview;
    vm.loadDocumentPreview = loadDocumentPreview;
    vm.refreshDocumentView = refreshDocumentView;
    vm.isCaseDocVersionEditable = isCaseDocVersionEditable;
    vm.activate = activate;
    vm.loadCaseDocumentInfo = loadCaseDocumentInfo;
    vm.loadCaseDocument = loadCaseDocument;
    vm.loadVersionDetails = loadVersionDetails;
    vm.afterDocumentDelete = afterDocumentDelete;
    vm.initDocPreviewController = initDocPreviewController;

    function activate() {
        this.initDocPreviewController();
        this.loadCaseDocumentInfo();
    }

    function loadCaseDocumentInfo() {
        var vm = this;
        return vm.loadCaseDocument().then(function(document) {
            vm.loadVersionDetails().then(function() {
                vm.refreshDocumentView();
            });
        });
    }

    function loadCaseDocument() {
        var vm = this;
        return caseDocumentDetailsService.getCaseDocument(vm.documentNodeRef).then(function(document) {
            vm.caseDocument = document;
            vm.doc = document;
            vm.doc.canEditOnlineDocument = (vm.doc.canEditOnlineDocument || false);
            vm.doc.nodeRef = vm.documentNodeRef;
            return document;
        });
    }

    function loadVersionDetails() {
        var vm = this;
        return caseDocumentDetailsService.getDocumentVersionInfo(vm.caseDocument.mainDocNodeRef).then(function(versions) {
            vm.documentVersions = versions;
            vm.docVersion = versions[0];
            vm.doc.canEditOnlineDocument = sharePointProtocolService.canEditOnline(versions[0].name);
        });
    }

    function refreshDocumentView() {
        var vm = this;
        vm.loadDocumentPreview();
        vm.doc.isDocumentEditable = vm.doc.isLocked === false && vm.isCaseDocVersionEditable();
    }

    function initDocPreviewController() {
        var vm = this;
        vm.docPreviewController = DocPreviewController;

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
    }

    function loadDocumentPreview() {
        var vm = this;
        var nodeRef = vm.caseDocument.mainDocNodeRef;
        if (vm.documentVersions[0].nodeRef != vm.docVersion.nodeRef) {
            nodeRef = vm.docVersion.nodeRef;
        }
        documentPreviewService.previewDocumentPlugin(nodeRef).then(function(plugin) {
            vm.docPreviewControllerObj.setPreviewPlugin(plugin);
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

    function showDocumentEditActions() {
        var vm = this;
        if (vm.doc == undefined) {
            return null;
        }
        var visibleActions = vm.documentEditActions.filter(function(action) {
            return action.isVisible(vm.doc);
        });
        return visibleActions.length > 0;
    }

    function disableDocumentEditActions() {
        var vm = this;
        if (vm.doc == undefined) {
            return null;
        }
        var notDisabledActions = vm.documentEditActions.filter(function(action) {
            return action.isVisible(vm.doc) && !action.isDisabled(vm.doc);
        });
        return notDisabledActions.length === 0;
    }

    function uploadDocNewVersion() {
        var vm = this;
        vm.loadCaseDocument().then(function() {
            if (vm.doc.editLockState.isLocked) {
                return;
            }
            caseDocumentFileDialogService.uploadCaseDocumentNewVersion(vm.documentNodeRef).then(function(result) {
                vm.loadCaseDocumentInfo();
                setTimeout(loadDocumentPreview, 500);
            });
        });
    }

    function editDocumentProperties() {
        var vm = this;
        caseDocumentFileDialogService.editDocumentProperties(vm.documentNodeRef).then(function(result) {
            vm.loadCaseDocumentInfo();
        });
    }

    function isCaseDocVersionEditable() {
        var vm = this;
        if (!vm.documentVersions) {
            return false;
        }
        return vm.documentVersions[0].nodeRef == vm.docVersion.nodeRef;
    }

    function changeDocumentStatus(status) {
        var vm = this;
        caseDocumentDetailsService.changeDocumentStatus(vm.documentNodeRef, status).then(function(json) {
            vm.loadCaseDocumentInfo();
            notificationUtilsService.notify($translate.instant("DOCUMENT.STATUS_CHANGED_SUCCESS"));
        }, showError);
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
            }, showError);
        });
    }

    function afterDocumentDelete() {
        $location.path("/");
    }

    function executeEditAction(menuItem) {
        var vm = this;
        var service = $injector.get(menuItem.serviceName);
        service.executeCaseDocAction(vm.doc, function() {
            setTimeout(function() {
                vm.loadCaseDocumentInfo();
            }, 2000);
        }, showError, vm._scope);
    }

    function showError(error) {
        if (error && error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
}