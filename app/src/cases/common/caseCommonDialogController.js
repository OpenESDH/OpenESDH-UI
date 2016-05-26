    angular
        .module('openeApp.cases.common')
        .controller('CaseCommonDialogController', CaseCommonDialogController);
    
    function CaseCommonDialogController($mdDialog, $translate, $filter, $controller, caseCrudDialogService, caseService, 
            caseDocumentsService, notificationUtilsService, sessionService, userService, caseInfo) {
        angular.extend(this, $controller('CaseNodeDialogController', {}));
        var vm = this;
        vm.formTemplateUrl = "app/src/cases/common/view/caseCrudForm.html";
        // Data from the case creation form
        vm.caseInfo = caseInfo;
        vm.editCase = (caseInfo.newCase !== true);
        vm.cancel = cancel;
        vm.save = save;
        vm._saveNew = _saveNew;
        vm._update = _update;
        vm.init = init;
        vm.initCasePropsForEdit = initCasePropsForEdit;
        vm.getPropsToSave = getPropsToSave;
        vm.initExtras = initExtras;
        vm.hasCaseTemplateSelector = false;
        vm.initCaseTemplateSelector = initCaseTemplateSelector;
        vm.loadDocumentConstraints = loadDocumentConstraints;
        vm.extrasUI = [];
        vm.documents = [];
        
        function getUserInfo(){
            return sessionService.getUserInfo();
        }
        
        function init(){
            var vm = this;

            if(vm.editCase === true){
                vm.initCasePropsForEdit();
                vm.oldCase = angular.copy(vm.case);
                angular.extend(vm.case, {'owner': vm.caseInfo.properties.owners[0].displayName});
            }else{
                userService.getCurrentUser().then(function(response) {
                    vm.case = {
                        prop_base_startDate: new Date(),
                        prop_base_endDate: null,
                        prop_oe_journalKey: [],
                        prop_oe_journalFacet: [],
                        owner: sessionService.getUserInfo().user.firstName + ' ' + sessionService.getUserInfo().user.lastName,
                        assoc_base_owners_added: response.nodeRef
                    };
                });
            }
            vm.initExtras();
        }
        
        function initExtras(){
            var vm = this;
            var extras = caseCrudDialogService.getCrudExtras(vm.caseInfo.type);
            angular.forEach(extras, function(extra){
                angular.extend(vm, $controller(extra.controller, {caseInfo: vm.caseInfo}));
                vm.initExtra();
            });
        }
        
        function initCaseTemplateSelector(){
            var vm = this;
            var selectorConfig = caseTemplateSelectorsService.getTemplateSelector(vm.caseInfo.type);
            if(selectorConfig == null){
                return;
            }
            angular.extend(vm, $controller(selectorConfig.controller, {caseType: vm.caseInfo.type}));
            vm.initTemplateSelector();
            vm.hasCaseTemplateSelector = true;
        }

        function initCasePropsForEdit(){
            var vm = this;
            var caseObj = vm.getCasePropsForEdit(vm.caseInfo);
            vm.case = {};
            angular.extend(vm.case, caseObj);
        }
        
     // Cancel or submit form in dialog
        function cancel(form) {
            $mdDialog.cancel();
        }
        
        function save() {
            var vm = this;
            if(vm.editCase === true){
                return vm._update();
            }else{
                return vm._saveNew();
            }
        }
        
        function _saveNew() {
            var vm = this;
            var props = vm.getPropsToSave();
            
            if(vm.documents.length > 0){
                props.prop_oe_tempAttachments = angular.toJson(vm.documents);
            }
            
            // When submitting, do something with the case data
            return caseService.createCase(vm.caseInfo.type, props).then(function (caseNodeRef){
                // When the form is submitted, show a notification:
                notificationUtilsService.notify($translate.instant("CASE.CASE_CREATED", {case_title: props.prop_cm_title}));
                
                return caseService.getCaseId(caseNodeRef).then(function(caseId){
                    $mdDialog.hide(caseId);
                    return caseId;
                }, function(error){
                    if (error.domain && error.code === 'ERROR.ACCESS_DENIED'){
                        //case was created for other user and we cannot access it
                        $mdDialog.cancel();
                    }
                    return error;
                });
            }, function(error) {
                if (error.domain){
                    notificationUtilsService.alert(error.message);
                }
            });
        }
        
        function _update(){
            var vm = this;
            var props = vm.getPropsToSave();
            return caseService.updateCase(vm.caseInfo.properties.nodeRef, props).then(function(result){
                notificationUtilsService.notify($translate.instant("CASE.CASE_UPDATED", {case_title: props.prop_cm_title}));
                $mdDialog.hide(result);
            });    
        }
        
        function getPropsToSave(){
            var vm = this;
            return vm.retrievePropsToSave(vm.case, vm.oldCase);
        }
        
        function loadDocumentConstraints(scope){
            var vm = this;
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                scope.documentConstraints = documentConstraints;
            });
        }
        
        
    }
