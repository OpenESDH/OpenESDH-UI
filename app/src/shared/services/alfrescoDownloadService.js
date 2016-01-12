
    angular
        .module('openeApp')
        .factory('alfrescoDownloadService', AlfrescoDownloadService);

    function AlfrescoDownloadService(alfrescoNodeUtils, sessionService, ALFRESCO_URI) {
        
        var service = {
            downloadFile: downloadFile
        };
        return service;
        
        function downloadFile(nodeRef, fileName){
            
            var url = ALFRESCO_URI.webClientServiceProxy + "/api/node/content/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/" + fileName + "?a=true";
            
            var iframe = document.querySelector("#downloadFrame");
            if(iframe === null){
                iframe = angular.element("<iframe id='downloadFrame' style='position:fixed;display:none;top:-1px;left:-1px;'/>");
                angular.element(document.body).append(iframe);
            }else{
                iframe = angular.element(iframe);
            }
            
            iframe.attr("src", url);
        }
        
    }