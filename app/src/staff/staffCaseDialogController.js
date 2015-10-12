    angular
        .module('openeApp.cases.common')
        .controller('StaffCaseDialogController', StaffCaseDialogController);
    
    function StaffCaseDialogController($controller, caseInfo) {
        angular.extend(this, $controller('CaseCommonDialogController', {caseInfo: caseInfo}));
        var vm = this;
        vm.formTemplateUrl = 'app/src/staff/view/staffCaseCrudForm.html';
        vm.initCommonCasePropsForEdit = vm.initCasePropsForEdit;
        vm.initCasePropsForEdit = initCasePropsForEdit; 
        vm.init();
        
        function initCasePropsForEdit(){
            var vm = this;
            vm.initCommonCasePropsForEdit();
            var c = vm.caseInfo.allProps.properties;
            angular.extend(vm.case, {
                prop_staff_hireDate: this.getDateValue(c['staff:hireDate']),
                prop_staff_resignationDate: this.getDateValue(c['staff:resignationDate']),
                prop_staff_salary: this.getNumberValue(c['staff:salary'])
            });
        }
    }