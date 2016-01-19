
angular
        .module('openeApp.files')
        .factory('filesService', FilesService);

function FilesService($http, fileUtilsService, alfrescoNodeUtils) {

    return {
        getUserFiles: getUserFiles,
        getGroupFiles: getGroupFiles,
        uploadFile: uploadFile,
        deleteFile: deleteFile,
        moveFile: moveFile
    };

    /**
     * Lists all files assigned to current user
     * @returns {*}
     */
    function getUserFiles() {
        return $http.get('/api/openesdh/files')
                .then(_fileListResponse);
    }

    /**
     * Lists all files assigned to any group of user
     * @returns {*}
     */
    function getGroupFiles() {
        return $http.get('/api/openesdh/files/group')
                .then(_fileListResponse);
    }



    function _fileListResponse(response) {
        return response.data.map(function(file) {
            file.thumbNailURL = fileUtilsService.getFileIconByMimetype(file.mimetype, 24);
            return file;
        });
    }

    /**
     * Uploads file and assigns it to specified user or group
     * @param owner - nodeRefId of user or group
     * @param file
     * @returns void
     */
    function uploadFile(owner, file) {
        var formData = new FormData();
        formData.append('owner', owner);
        formData.append('file', file);
        return $http.post('/api/openesdh/files', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
            return response.data;
        });
    }

    function deleteFile(nodeRef) {
        return $http.delete('/api/openesdh/file/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri)
                .then(function(response) {
                    return response;
                });
    }

    function moveFile(nodeRef, newOwner, comment) {
        return $http.put('/api/openesdh/file/assign',
                null, {params: {
                        nodeRef: nodeRef,
                        owner: newOwner,
                        comment: comment
                    }})
        .then(function(response) {
            return response;
        });
    }
}
