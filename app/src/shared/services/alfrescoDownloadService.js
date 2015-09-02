(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('alfrescoDownloadService', AlfrescoDownloadService);

    AlfrescoDownloadService.$inject = ['$http', 'alfrescoNodeUtils'];

    function AlfrescoDownloadService($http, alfrescoNodeUtils) {
        
        var service = {
            downloadFile: downloadFile
        };
        return service;
        
        function downloadFile(nodeRef, fileName){
            
            var url = "/alfresco/service/api/node/content/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/" + fileName;
            
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
})();
