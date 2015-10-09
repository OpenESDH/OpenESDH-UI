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
                prop_staff_hireDate: new Date(c['staff:hireDate'].value),
                prop_staff_resignationDate: new Date(c['staff:resignationDate'].value),
                prop_staff_salary: Number(c['staff:salary'].value)
            });
        }
    }