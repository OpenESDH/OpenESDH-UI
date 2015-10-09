    angular
        .module('openeApp.cases.staff', ['openeApp.cases.common'])
        .config(config);
    
    function config(caseCrudDialogServiceProvider){
        caseCrudDialogServiceProvider.caseCrudForm({
            type: 'staff:case',
            controller: 'StaffCaseDialogController',
            controllerAs: 'vm',
            templateUrl: 'app/src/cases/common/view/caseCrudDialog.html'
        });
    }

