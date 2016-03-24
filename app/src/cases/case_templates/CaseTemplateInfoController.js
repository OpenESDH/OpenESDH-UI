    angular
        .module('openeApp.caseTemplates')
        .controller('CaseTemplateInfoController', CaseTemplateInfoController);
    
    function CaseTemplateInfoController($state, $stateParams, $controller, $mdDialog, $translate, caseTemplatesService, startCaseWorkflowService, 
            caseDocumentsService, caseTemplateDialogService, caseDocumentFileDialogService, alfrescoFolderService, notificationUtilsService){
        
        angular.extend(this, $controller('DocumentsController'));
        
        var vm = this;
        vm.includeExtra = false;
        vm.init = init;
        vm.loadTemplate = loadTemplate;
        vm.reloadDocuments = reloadDocuments;
        vm.isPropSet = isPropSet;
        vm.getWorkflowDisplayName = getWorkflowDisplayName;
        vm.editTemplate = editTemplate;
        vm.deleteDocument = deleteDocument;
        vm.deleteTemplate = deleteTemplate;
        vm.nodeRef = $stateParams.storeType + "/" + $stateParams.storeId + "/" + $stateParams.id;
        
        function init(){
            var vm = this;
            startCaseWorkflowService.getWorkflowDefinitions().then(function(result){
                vm.workflowDefs = result;
                caseDocumentsService.getDocumentsFolderNodeRefByCaseRef(vm.nodeRef).then(function(result){
                    vm.docsFolderNodeRef = result.caseDocsFolderNodeRef;
                    vm.loadTemplate();
                    vm.reloadDocuments();
                })
            });
        }
        
        function loadTemplate(){
            var vm = this;
            caseTemplatesService.getTemplateInfo(vm.nodeRef).then(function(result){
                vm.template = result;
                vm.props = result.properties;
            });
        }
        
        function reloadDocuments(){
            var vm = this;
            caseTemplatesService.getTemplateDocs(vm.nodeRef).then(function(result){
                vm.documents = result;
                vm.addThumbnailUrl();
            });
        }
        
        function isPropSet(prop){
            var vm = this;
            if(vm.template === undefined){
                return false;
            }
            var value = vm.template.properties[prop];
            if(value === undefined || value === "" || value.value === undefined || value.value === ""){
                return false;
            }
            if(prop == "oe:owners" && value.value[0] == "admin"){
                return false;
            }
            return true;
        }
        
        function getWorkflowDisplayName(workflowDefId){
            var vm = this;
            for(var i = 0; i < vm.workflowDefs.length; i++){
                if(workflowDefId == vm.workflowDefs[i].id){
                    return vm.workflowDefs[i].title;
                }
            }
            return workflowDefId;
        }
        
        function editTemplate(){
            var vm = this;
            caseTemplateDialogService.editTemplate(vm.template).then(function(){
                vm.loadTemplate();
            });
        }
        
        function deleteDocument(doc){
            var vm = this;
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('CASE_TEMPLATES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT', {document_title: doc["cm:title"]}))
                    .ariaLabel('')
                    .targetEvent(null)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                alfrescoFolderService.deleteFolder(doc.nodeRef).then(function(result) {
                    notificationUtilsService.notify($translate.instant('DOCUMENT.DELETE_DOC_SUCCESS'));
                    vm.reloadDocuments();
                }, function(result) {
                    console.log(result);
                    notificationUtilsService.alert($translate.instant('DOCUMENT.DELETE_DOC_FAILURE'));
                });
            });
        }
        
        function deleteTemplate(){
            var vm = this;
            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('CASE_TEMPLATES.ARE_YOU_SURE_YOU_WANT_DELETE_TEMPLATE', {name: vm.props["cm:name"].value}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                var nodeRef = $stateParams.storeType + "://" + $stateParams.storeId + "/" + $stateParams.id
                alfrescoFolderService.deleteFolder(nodeRef).then(function(result) {
                    $state.go('administration.systemsettings.stafftemplates');
                }, function(result) {
                    console.log(result);
                });
            });
        }
    }