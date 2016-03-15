angular
        .module('openeApp.cases')
        .controller('CreateCaseMenuController', CreateCaseMenuController);

    function CreateCaseMenuController(caseCrudDialogService, sessionService) {
        var userCapabilities = sessionService.getUserInfo().user.capabilities;
        console.log("capab", userCapabilities);
        var vm = this;
        vm.registeredCaseTypes = caseCrudDialogService.getRegisteredCaseTypes().filter(function(fullType){
            var delimiter = fullType.indexOf(':');
            var type = fullType.substr(0, delimiter);
            var creatorCapability = 'Case' + type.charAt(0).toUpperCase() + type.slice(1) + 'Creator';
            var isCapable = userCapabilities[creatorCapability];
            return isCapable === true;
        });
        vm.createCase = createCase;
        
        function createCase(ev, caseType, callback) {
            caseCrudDialogService.createCase(caseType, callback);
        }
    }