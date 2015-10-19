
    angular
        .module('openeApp')
        .factory('alfrescoDocumentService', AlfrescoDocumentService);

    function AlfrescoDocumentService($http, alfrescoNodeUtils) {
        
        var service = {
            retrieveSingleDocument: retrieveSingleDocument
        };
        return service;
        
        function retrieveSingleDocument(nodeRef){
            var params = "?view=browse&noCache=" + new Date().getTime() + "&includeThumbnails=true";
            var url = "/alfresco/service/slingshot/doclib2/node/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + params;
            return $http.get(url).then(function(result){
                return result.data.item;
            });
        }
        
    }