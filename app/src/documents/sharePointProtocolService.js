
angular
        .module('openeApp.documents')
        .factory('sharePointProtocolService', SharePointProtocolService);

function SharePointProtocolService(fileUtilsService) {
    var service = {
        canEditOnline: canEditOnline,
        editOnlineDocument: editOnlineDocument
    };
    return service;

    function canEditOnline(documentName) {
        var msprotocol = fileUtilsService.getMsProtocolForFile(documentName);
        return msprotocol !== undefined && msprotocol !== null;
    }

    function editOnlineDocument(editOnlinePath, documentName, onSuccess) {
        var docEditOnlinePath = editOnlinePath + "/" + documentName;
        var msProtocol = fileUtilsService.getMsProtocolForFile(docEditOnlinePath);
        var href = msProtocol + ":ofe|u|" + window.location.origin + "/alfresco" + docEditOnlinePath;
        location.href = href;
        setTimeout(onSuccess, 2000);
    }
}