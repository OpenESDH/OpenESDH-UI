    angular
        .module('openeApp.documents')
        .controller('CaseDocumentDetailsController', CaseDocumentDetailsController);

    function CaseDocumentDetailsController($scope, $stateParams, $controller, $location, caseDocumentDetailsExtrasService){
        angular.extend(this, $controller('DocumentDetailsController'));
        var vm = this;
        vm._scope = $scope;
        var caseId = $stateParams.caseId;
        vm.caseId = caseId;
        vm.afterDocumentDelete = afterDocumentDelete;
        
        init();
        
        function init(){            
            vm.activate();
            vm.extrasControllers = caseDocumentDetailsExtrasService.getExtrasControllers();
        }
        
        function afterDocumentDelete(){
            $location.path("/cases/case/" + caseId);
        }
    }