    angular
        .module('openeApp.documents')
        .controller('CaseDocumentDetailsController', CaseDocumentDetailsController);

    function CaseDocumentDetailsController($scope, $stateParams, $controller, $location, projectRoomsService){
        angular.extend(this, $controller('DocumentDetailsController'));
        var vm = this;
        var caseId = $stateParams.caseId;
        vm.caseId = caseId;
        vm.afterDocumentDelete = afterDocumentDelete;
        
        init();
        
        function init(){            
            vm.activate();
            projectRoomsService.getCaseSites(vm.caseId).then(function(sites){
                if(sites.length == 0){
                    vm.hasProjectRoom = false;
                    return;
                }
                vm.hasProjectRoom = true;
            });
        }
        
        function afterDocumentDelete(){
            $location.path("/cases/case/" + caseId);
        }
    }