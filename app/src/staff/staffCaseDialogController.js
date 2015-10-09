    angular
        .module('openeApp.cases.common')
        .controller('StaffCaseDialogController', StaffCaseDialogController);
    
    function StaffCaseDialogController($controller, caseObj) {
        angular.extend(this, $controller('CaseCommonDialogController', {caseObj: caseObj}));
        var vm = this;
        vm.init();
        
        vm.getCommonCasePropsToSave = vm.getCasePropsToSave;
        
        vm.getCasePropsToSave = function(){
            var caseProps = vm.getCommonCasePropsToSave();
            var caseObj = vm.case;
            caseProps.prop_staff_hireDate = caseObj.hireDate; 
            return caseProps;
        }
        
    }