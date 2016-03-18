
angular
        .module('openeApp.documents')
        .factory('caseDocumentEditInSharePointService', caseDocumentEditInSharePointService);

function caseDocumentEditInSharePointService(caseDocumentDetailsService) {
    var service = {
        executeCaseDocAction: executeCaseDocAction
    };
    return service;

    function executeCaseDocAction(doc, _scope, onSuccess, onError) {
        caseDocumentDetailsService.getCaseDocument(doc.nodeRef).then(function(document) {
            if (document.isLocked) {
                return;
            }
            return caseDocumentDetailsService.getDocumentVersionInfo(document.mainDocNodeRef).then(function(versions) {
                caseDocumentDetailsService.editOnlineDocument(document.editOnlinePath, versions[0].name, onSuccess);
            });
        });
    }

}