angular
        .module('openeApp.documents')
        .controller('DocumentsController', DocumentsController);

function DocumentsController($state, $stateParams, $mdDialog, $translate, caseDocumentsService, fileUtilsService, caseDocumentFileDialogService, documentPreviewService, 
        formProcessorService, alfrescoNodeUtils, alfrescoFolderService, notificationUtilsService) {
    var vm = this;
    vm.uploadDocument = uploadDocument;
    vm.previewDocument = previewDocument;
    vm.noDocuments = noDocuments;
    vm.addThumbnailUrl = addThumbnailUrl;
    vm.createFolder = createFolder;
    vm.openItem = openItem;
    vm.openFolder = openFolder;
    vm.editFolder = editFolder;
    vm.deleteFolder = deleteFolder;
    vm.showFolderDialog = showFolderDialog;
    vm.breadcrumbs = [];
    vm.crumbClick = crumbClick;
    vm.initSuperController = initSuperController;
    vm.loadDocuments = loadDocuments;
    vm.reloadDocuments = reloadDocuments;
    vm.setSubfolderState = setSubfolderState;
    vm.openDocument = openDocument;

    function initSuperController(){
        var vm = this;
        vm.rootDocsFolder = vm.docsFolderNodeRef;
        if($stateParams.subfolder != undefined){
            vm.docsFolderNodeRef = $stateParams.subfolder;
            caseDocumentsService.getDocsFolderPath(vm.docsFolderNodeRef).then(function(result){
                vm.breadcrumbs = result;
            });
        }
        vm.loadDocuments();
    }
    
    function loadDocuments() {
        var vm = this;
        caseDocumentsService.getDocsFolderContents(vm.docsFolderNodeRef).then(function(response) {
            vm.documents = response.documents;
            vm.addThumbnailUrl();
        });
    }
    
    function reloadDocuments(){
        var vm = this;
        vm.loadDocuments();
     }

    function addThumbnailUrl() {
        var vm = this;
        // Mimetype has different paths on caseDocs vs MyDocuments
        var mimeTypeProperty = 'mimetype';
        vm.documents.forEach(function(item) {
            if(item.folder === true){
                item.thumbNailURL = fileUtilsService.getFolderIcon(24);
            }else{
                item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item[mimeTypeProperty], 24);
            }
        });
    }

    function uploadDocument() {
        var vm = this;
        caseDocumentFileDialogService.uploadCaseDocument(vm.docsFolderNodeRef).then(function(result) {
            vm.reloadDocuments();
        });
    }
    
    function createFolder(){
        var vm = this;
        vm.showFolderDialog(null);
    }
    
    function editFolder(folder){
        var vm = this;
        vm.showFolderDialog(folder);
    }
    
    function showFolderDialog(folder){
        var vm = this;
        $mdDialog.show({
            controller: CaseDocsFolderDialog,
            controllerAs: 'dlg',
            templateUrl: 'app/src/documents/view/folderCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            locals: {
                parentRef: vm.docsFolderNodeRef,
                folder: folder
            }
        }).then(function(){
            vm.reloadDocuments();
        });
    }
    
    function CaseDocsFolderDialog($mdDialog, formProcessorService, parentRef, folder){
        var dlg = this;
        dlg.folderName = '';
        dlg.isNew = folder == null;
        dlg.save = save;
        
        if(folder != null){
            dlg.folderName = folder.title;
        }
        
        dlg.cancel = function(){
            $mdDialog.cancel();
        };
        
        function save(){
            var props = {
                    prop_cm_name: dlg.folderName,
                    prop_cm_title: dlg.folderName
            };
            if(dlg.isNew){
                props.alf_destination = parentRef;
                formProcessorService.createNode("cm:folder", props).then(function(nodeRef){
                    $mdDialog.hide(nodeRef);
                });
            }else{
                formProcessorService.updateNode(folder.nodeRef, props).then(function(){
                    $mdDialog.hide();
                });
            }
        }
    }
    
    function deleteFolder(folder){
        var vm = this;
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_FOLDER', {title: folder["cm:name"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            alfrescoFolderService.deleteFolder(folder.nodeRef).then(function(result) {
                notificationUtilsService.notify($translate.instant('DOCUMENT.DELETE_FOLDER_SUCCESS'));
                vm.reloadDocuments();
            });
        });
    }
    
    function openItem(item){
        var vm = this;
        if(item.folder === true){
            vm.openFolder(item)
            return;
        }
        vm.openDocument(item);
    }
    
    function openDocument(item){
        var vm = this;
        var nodeRef = alfrescoNodeUtils.processNodeRef(item.nodeRef);
        var params = {
                storeType: nodeRef.storeType,
                storeId: nodeRef.storeId,
                id: nodeRef.id,
                subfolder: $stateParams.subfolder
        }; 
        angular.extend(params, vm.docDetailsState.params);
        $state.go(vm.docDetailsState.name, params);
    }
    
    function openFolder(folder){
        var vm = this;
        vm.breadcrumbs.push(folder);
        vm.docsFolderNodeRef = folder.nodeRef;
        vm.setSubfolderState(folder);
        vm.reloadDocuments();
    }
    
    function crumbClick(folder){
        var vm = this;
        if(folder == undefined){
            vm.breadcrumbs = [];
            vm.docsFolderNodeRef = vm.rootDocsFolder;
        }else{
            vm.breadcrumbs.splice(vm.breadcrumbs.indexOf(folder) + 1);
            vm.docsFolderNodeRef = folder.nodeRef;    
        }
        vm.setSubfolderState(folder);
        vm.reloadDocuments();
    }
    
    function setSubfolderState(folder){
        var params = angular.copy($stateParams);
        if(folder == undefined){
            delete params.subfolder;
        }else{
            params.subfolder = folder.nodeRef;    
        }
        $state.transitionTo($state.current.name, params, {notify: false, reload: true});
    }

    function previewDocument(nodeRef) {
        documentPreviewService.previewDocument(nodeRef);
    }

    function noDocuments() {
        var vm = this;
        return typeof vm.documents === 'undefined' || vm.documents.length === 0;
    }
}