
    angular
        .module('openeApp')
        .factory('alfrescoFolderService', alfrescoFolderService);

    function alfrescoFolderService($http, alfrescoNodeUtils) {
        var service = {
            deleteFolder: deleteFolder
        };
        
        function deleteFolder(nodeRef){
            var url = '/slingshot/doclib/action/folder/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri;
            return $http.delete(url).then(function(result){
                return result.data;
            })
        }
        
        return service;
    }