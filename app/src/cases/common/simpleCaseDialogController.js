    angular
        .module('openeApp.cases.common')
        .controller('SimpleCaseDialogController', SimpleCaseDialogController);
    
    function SimpleCaseDialogController($controller, caseInfo) {
        angular.extend(this, $controller('CaseCommonDialogController', {caseInfo: caseInfo}));
        var vm = this;
        vm.init();
    }