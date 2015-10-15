angular
        .module('openeApp.cases')
        .controller('CreateCaseMenuController', CreateCaseMenuController);

    function CreateCaseMenuController(caseCrudDialogService) {
        var vm = this;
        vm.registeredCaseTypes = caseCrudDialogService.getRegisteredCaseTypes();
        vm.createCase = createCase;
        
        function createCase(ev, caseType, callback) {
            caseCrudDialogService.createCase(caseType, callback);
        }
    }