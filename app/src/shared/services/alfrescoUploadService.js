(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('alfrescoUploadService', AlfrescoUploadService);

    AlfrescoUploadService.$inject = ['$http'];

    function AlfrescoUploadService($http) {
        
        var service = {
            uploadFile: uploadFile
        };
        return service;
        
        function uploadFile(file, destination, extras){
            
            var formData = new FormData();
            formData.append("filedata", file);
            formData.append("filename", file.name);
            formData.append("destination", destination ? destination : null);

            if(!extras || !extras.majorVersion){
                formData.append("majorVersion", "false");    
            }
            
            /**
             * optional fields which may be passed via extras:
             * 
             *      siteId
             *      containerId
             *      uploaddirectory
             *      majorVersion
             *      updateNodeRef
             *      description
             *      username
             *      overwrite
             *      thumbnails
             *      username
             */
            
            if(extras){
                angular.forEach(extras, function (value, key) {
                    formData.append(key, value);
                });
            }
            
            return $http.post("/alfresco/service/api/upload", formData,  {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response;
            });
        }
        
    }
})();
