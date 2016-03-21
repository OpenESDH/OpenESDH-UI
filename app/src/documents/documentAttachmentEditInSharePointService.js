angular
        .module('openeApp.documents')
        .factory('documentAttachmentEditInSharePointService', DocumentAttachmentEditInSharePointService);

function DocumentAttachmentEditInSharePointService($http, caseDocumentDetailsService, sharePointProtocolService) {
    var service = {
        executeDocAttachmentAction: executeDocAttachmentAction
    };
    return service;

    function executeDocAttachmentAction(attachment, onSuccess, onError) {
        $http.get('/api/openesdh/document/attachment/edit/spp?nodeRefId=' + attachment.nodeRef).then(function(response) {
            var attachmentData = response.data;
            if (attachmentData.isLocked) {
                //onSuccess refreshes page to lock buttons
                onSuccess();
                return;
            }
            sharePointProtocolService.editOnlineDocument(attachmentData.editOnlinePath, attachmentData.currentVersionDocumentName, onSuccess);
        }, onError);
    }
}