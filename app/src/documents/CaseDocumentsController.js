
angular
        .module('openeApp.documents')
        .controller('CaseDocumentsController', CaseDocumentsController);

function CaseDocumentsController($scope, $controller, $stateParams, caseDocumentsService) {

    angular.extend(this, $controller('DocumentsController'));
    
    var caseId = $stateParams.caseId;
    var vm = this;
    vm.docDetailsState = {
            name: 'docDetails',
            params: {
                caseId: caseId
            }
    };
    vm.caseId = caseId;
    vm.reloadDocuments = reloadDocuments;
    vm.init = init;
    vm.init();

    function reloadDocuments(){
        $scope.civm.reloadCaseInfo();
        this.loadDocuments();
    }
    
    function init() {
        var vm = this;        
        caseDocumentsService.getDocumentsFolderNodeRef(caseId).then(function(res){
            vm.docsFolderNodeRef = res.caseDocsFolderNodeRef;
            vm.initSuperController();
        });
    }
}
