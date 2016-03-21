
angular
        .module('openeApp.documents')
        .factory('documentEditInSharePointService', DocumentEditInSharePointService);

function DocumentEditInSharePointService($http, sharePointProtocolService) {
    var service = {
        executeCaseDocAction: executeCaseDocAction
    };
    return service;

    function executeCaseDocAction(doc, onSuccess, onError) {
        var params = {
            'nodeRefId': doc.nodeRef,
            'no-cache': new Date().getTime()
        };
        $http.get('/api/openesdh/document/edit/spp', { params: params }).then(function(response) {
            var document = response.data;
            if (document.isLocked) {
                //onSuccess refreshes page to lock buttons
                onSuccess();
                return;
            }
            sharePointProtocolService.editOnlineDocument(document.editOnlinePath, document.currentVersionDocumentName, onSuccess);
        }, onError);
    }

}