
    angular
        .module('openeApp')
        .factory('alfrescoDocumentService', AlfrescoDocumentService);

    function AlfrescoDocumentService($http, alfrescoNodeUtils) {
        
        var service = {
            retrieveSingleDocument: retrieveSingleDocument,
            deleteFile: deleteFile
        };
        return service;
        
        function retrieveSingleDocument(nodeRef){
            var params = "?view=browse&noCache=" + new Date().getTime() + "&includeThumbnails=true";
            var url = "/slingshot/doclib2/node/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + params;
            return $http.get(url).then(function(result){
                return result.data.item;
            });
        }
        
        function deleteFile(nodeRef){
            return $http.delete('/slingshot/doclib/action/file/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri);
        }
        
    }