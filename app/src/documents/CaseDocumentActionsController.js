angular
        .module('openeApp.documents')
        .controller('CaseDocumentActionsController', CaseDocumentActionsController);

function CaseDocumentActionsController(caseDocumentActionsService) {
    var vm = this;
    vm.actions = caseDocumentActionsService.getActions();
}
