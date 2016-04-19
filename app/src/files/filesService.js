
angular
        .module('openeApp.files')
        .factory('filesService', FilesService);

function FilesService($http, fileUtilsService, alfrescoNodeUtils) {

    return {
        getUserFiles: getUserFiles,
        getGroupFiles: getGroupFiles,
        getFiles: getFiles,
        uploadFiles: uploadFiles,
        uploadOwnerFiles: uploadOwnerFiles,
        deleteFile: deleteFile,
        moveFile: moveFile,
        addFileToCase: addFileToCase
    };

    /**
     * Lists all files assigned to current user
     * @returns {*}
     */
    function getUserFiles() {
        return $http.get('/api/openesdh/files/user')
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

    /**
     * Lists all files assigned to nodeRef
     * @param decomposed nodeRef
     * @returns {*}
     */
    function getFiles(storeProtocol, storeIdentifier, uuid) {
        return $http.get('/api/openesdh/files/' + storeProtocol + '/' + storeIdentifier + '/' + uuid)
                .then(_fileListResponse);
    }

    function _fileListResponse(response) {
        return response.data.map(function(file) {
            file.thumbNailURL = fileUtilsService.getFileIconByMimetype(file.cm.content.mimetype, 24);
            return file;
        });
    }

    /**
     * Uploads file and assigns it to specified nodeRef
     * @param nodeRef - nodeRefId of parent where files will be added
     * @param files - multiple input files
     * @param comment - to be assigned to every file
     * @returns void
     */
    function uploadFiles(nodeRef, files, comment) {
        var formData = new FormData();
        formData.append('nodeRef', nodeRef);
        return _uploadFiles('/api/openesdh/files', formData, files, comment);
    }
    
    /**
     * Uploads file and assigns it to specified user or group
     * @param owner - nodeRefId of user or group
     * @param files - multiple input files
     * @param comment - to be assigned to every file
     * @returns void
     */
    function uploadOwnerFiles(owner, files, comment) {
        var formData = new FormData();
        formData.append('owner', owner);
        return _uploadFiles('/api/openesdh/files/owner', formData, files, comment);
    }
    
    function _uploadFiles(url, formData, files, comment){
        if (comment) {
            formData.append('comment', comment);
        }
        angular.forEach(files, function(file) {
            formData.append('file', file);
        });
        return $http.post(url, formData, {
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
                        comment: comment || ''
                    }})
                .then(function(response) {
                    return response;
                });
    }

    function addFileToCase(caseId, nodeRef, documentProperties) {
        return $http.put('/api/openesdh/case/' + caseId + '/addFile', null,
                {params: angular.extend(documentProperties, {nodeRef: nodeRef})})
                .then(function(response) {
                    return response;
                });
    }
}
