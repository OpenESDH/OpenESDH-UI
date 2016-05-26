angular
        .module('openeApp.cases')
        .controller('CreateCaseMenuController', CreateCaseMenuController);

function CreateCaseMenuController(caseCrudDialogService, authService) {
    var vm = this;
    vm.registeredCaseTypes = [];
    vm.createCase = createCase;
    
    authService.getUserCapabilities().then(
            function(userCapabilities) {
                vm.registeredCaseTypes = caseCrudDialogService.getRegisteredCaseTypes().filter(
                        function(fullType) {
                            var delimiter = fullType.indexOf(':');
                            var type = fullType.substr(0, delimiter);
                            var creatorCapability = 'Case' + type.charAt(0).toUpperCase() + type.slice(1) + 'Creator';
                            var isCapable = userCapabilities[creatorCapability];
                            return isCapable === true;
                        });
            });

    function createCase(ev, caseType, callback) {
        caseCrudDialogService.createCase(caseType, callback);
    }
}