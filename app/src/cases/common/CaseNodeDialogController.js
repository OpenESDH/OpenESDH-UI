    angular
        .module('openeApp.cases.common')
        .controller('CaseNodeDialogController', CaseNodeDialogController);
    
    function CaseNodeDialogController(){
        var vm = this;
        vm.retrievePropsToSave = retrievePropsToSave;
        vm.getCasePropsForEdit = getCasePropsForEdit;
        vm.getDateValue = getDateValue;
        vm.getNumberValue = getNumberValue;
        vm.getValue = getValue;
        
        function retrievePropsToSave(newCase, oldCase){
            var props = angular.copy(newCase);
            
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
            
            if(oldCase === undefined){
                return props;
            }
            
            if(props.assoc_base_owners_added != oldCase.assoc_base_owners_added){
                props.assoc_base_owners_removed = oldCase.assoc_base_owners_added;
            }else{
                delete props.assoc_base_owners_added;
            }
            
            return props;
        }
        
        function getCasePropsForEdit(caseInfo){
            var c = caseInfo.properties;
            
            var caseObj = {
                assoc_base_owners_added: c['owners'][0].nodeRef,
                prop_cm_title: c['cm:title'].displayValue,
                prop_oe_journalKey: [],
                prop_oe_journalFacet: [],
                prop_base_startDate: c['base:startDate'].value ? new Date(c['base:startDate'].value) : null,
                prop_base_endDate: c['base:endDate'].value ? new Date(c['base:endDate'].value) : null,
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
            return caseObj;
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