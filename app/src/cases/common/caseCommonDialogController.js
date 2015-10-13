    angular
        .module('openeApp.cases.common')
        .controller('CaseCommonDialogController', CaseCommonDialogController);
    
    function CaseCommonDialogController($mdDialog, $translate, userService, caseService, notificationUtilsService, caseInfo) {
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
        vm.getAuthorities = getAuthorities;
        vm.initCasePropsForEdit = initCasePropsForEdit;
        vm.getPropsToSave = getPropsToSave;
        vm.getDateValue = getDateValue;
        vm.getNumberValue = getNumberValue;
        vm.getValue = getValue;
        
        function init(){
            var vm = this;
            
            if(vm.editCase === true){
                vm.initCasePropsForEdit();
                vm.oldCase = angular.copy(vm.case);
            }else{
                vm.case = {
                    prop_base_startDate: new Date(),
                    prop_oe_journalKey: [],
                    prop_oe_journalFacet: []
                };
            }
            
            vm.getAuthorities();
        }

        function getAuthorities() {
            var vm = this;
            return userService.getAuthorities().then(function(response) {
                vm.authorities = response;
                return response;
            });
        }
        
        function initCasePropsForEdit(){
            var vm = this;
            var c = vm.caseInfo.properties;
            
            var caseObj = {
                assoc_base_owners_added: c['base:owners'].nodeRef[0],
                prop_cm_title: c['cm:title'].displayValue,
                prop_oe_journalKey: [],
                prop_oe_journalFacet: [],
                prop_base_startDate: new Date(c['base:startDate'].value),
                prop_cm_description: c['cm:description'].displayValue
            };
            
            if(c['oe:journalKey'].value){
                var nameTitle = c['oe:journalKey'].displayValue.split(' ');
                caseObj.prop_oe_journalKey.push({
                    value: c['oe:journalKey'].value,
                    nodeRef: c['oe:journalKey'].value,
                    name: nameTitle[0],
                    title: nameTitle[1]
                });    
            }
            
            if(c['oe:journalFacet'].value){
                var nameTitle = c['oe:journalFacet'].displayValue.split(' ');
                caseObj.prop_oe_journalFacet.push({
                    value: c['oe:journalFacet'].value,
                    nodeRef: c['oe:journalFacet'].value,
                    name: nameTitle[0],
                    title: nameTitle[1]
                });
            }
            
            
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
                vm._update();
            }else{
                vm._saveNew();
            }
        }
        
        function _saveNew(){
            var vm = this;
            var props = vm.getPropsToSave();
            // When submitting, do something with the case data
            caseService.createCase(vm.caseInfo.type, props).then(function (caseId) {
                // When the form is submitted, show a notification:
                notificationUtilsService.notify($translate.instant("CASE.CASE_CREATED", {case_title: props.prop_cm_title}));
                $mdDialog.hide(caseId);
                
            }, function (response) {
                notificationUtilsService.alert($translate.instant("CASE.ERROR_CREATING_CASE", {case_title: props.prop_cm_title}) + response.data.message);
            });
        }
        
        function _update(){
            var vm = this;
            var props = vm.getPropsToSave();
            caseService.updateCase(vm.caseInfo.properties.nodeRef, props).then(function(result){
                notificationUtilsService.notify($translate.instant("CASE.CASE_UPDATED", {case_title: props.prop_cm_title}));
                $mdDialog.hide(result);
            });    
        }
        
        function getPropsToSave(){
            var vm = this;
            var props = angular.copy(vm.case);
            
            for(var prop in props){
                if(props.hasOwnProperty(prop) && (props[prop] == null)){
                    props[prop] = "";
                }
            }
            
            if (props.prop_oe_journalKey != undefined && props.prop_oe_journalKey.length > 0) {
                props.prop_oe_journalKey = props.prop_oe_journalKey[0].nodeRef;
            } else {
                delete props.prop_oe_journalKey;
            }
            
            if (props.prop_oe_journalFacet != undefined && props.prop_oe_journalFacet.length > 0) {
                props.prop_oe_journalFacet = props.prop_oe_journalFacet[0].nodeRef;
            } else {
                delete props.prop_oe_journalFacet;
            }
            
            
            if(vm.editCase === false){
                return props;
            }
            
            if(props.assoc_base_owners_added != vm.oldCase.assoc_base_owners_added){
                props.assoc_base_owners_removed = vm.oldCase.assoc_base_owners_added;
            }else{
                delete props.assoc_base_owners_added;
            }
            
            return props;
        }
        
        function getDateValue(val){
            if(val === undefined || val.value === undefined){
                return "";
            }
            return new Date(val.value);
        }
        
        function getNumberValue(val){
            if(val === undefined || val.value === undefined){
                return "";
            }
            return Number(val.value);
        }
        
        function getValue(val){
            if(val == undefined || val.value === undefined){
                return "";
            }
            return val.value;
        }
    }
