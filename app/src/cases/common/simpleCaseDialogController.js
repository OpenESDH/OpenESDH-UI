    angular
        .module('openeApp.cases.common')
        .controller('SimpleCaseDialogController', SimpleCaseDialogController);
    
    function SimpleCaseDialogController($controller, caseObj) {
        angular.extend(this, $controller('CaseCommonDialogController', {caseObj: caseObj}));
        var vm = this;
        vm.init();
    }