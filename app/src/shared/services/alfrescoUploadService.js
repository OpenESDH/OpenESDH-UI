angular
        .module('openeApp')
        .factory('alfrescoUploadService', AlfrescoUploadService);

function AlfrescoUploadService($http, Upload) {

    var service = {
        uploadFile: uploadFile,
        uploadTempFile: uploadTempFile,
        uploadFileTrackProgress: uploadFileTrackProgress
    };
    return service;

    function uploadFile(file, destination, extras) {

        var formData = getFormData(file, destination, extras);

        return $http.post("/api/upload", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
            return response;
        });
    }
    
    function uploadFileTrackProgress(file, destination, extras){
        var data = {
                filedata: file,
                filename: file.name,
                title: file.title != undefined ? file.title : file.name,
                destination: destination ? destination : null
        };
        
        if (!extras || !extras.majorVersion) {
            data.majorVersion = "false";
        }
        
        if (extras) {
            angular.forEach(extras, function(value, key) {
                data[key] = value;
            });
        }
        
        return Upload.upload({
            url: '/api/upload',
            data: data,
            skipCanceled: true
        });
    }
    
    function getFormData(file, destination, extras){
        var formData = new FormData();
        formData.append("filedata", file);
        formData.append("filename", file.name);
        formData.append("destination", destination ? destination : null);

        if (!extras || !extras.majorVersion) {
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

        if (extras) {
            angular.forEach(extras, function(value, key) {
                formData.append(key, value);
            });
        }
        
        return formData;
    }
    
    function uploadTempFile(file){
        return Upload.upload({
            url: '/api/openesdh/files/upload/tmp',
            data: {
                filedata: file
            },
            skipCanceled: true
        });
    }
}