angular
        .module('openeApp.documents')
        .provider('caseDocumentActionsService', CaseDocumentActionsServiceProvider);

function CaseDocumentActionsServiceProvider() {
    
    var actions = [];
    this.addAction = addAction;
    this.$get = CaseDocumentActionsService;

    function addAction(templateUrl, order){
        actions.push({
            templateUrl: templateUrl,
            order: order
        });
    }
    
    function CaseDocumentActionsService() {
        var service = {
            getActions: getActions
        };
        return service;

        function getActions(){
            return actions;
        }
    }
}