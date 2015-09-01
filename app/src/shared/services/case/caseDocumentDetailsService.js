(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('caseDocumentDetailsService', CaseDocumentDetailsService);

    CaseDocumentDetailsService.$inject = ['$http', 'httpUtils', 'alfrescoUploadService', 'alfrescoNodeUtils'];

    function CaseDocumentDetailsService($http, httpUtils, alfrescoUploadService, alfrescoNodeUtils) {
        var service = {
            getCaseDocument: getCaseDocument,
            getDocumentVersionInfo: getDocumentVersionInfo,
            uploadDocumentNewVersion: uploadDocumentNewVersion
        };
        return service;
        
        function getCaseDocument(storeType, storeId, id){
             var requestConfig = { 
                 url: "/alfresco/service/api/openesdh/documentInfo/" + storeType + "/" + storeId + "/" + id,
                 method: "GET"
             };
             
             return $http(requestConfig).then(function(response){
                 return response.data;
             });
        }
        
        function getDocumentVersionInfo(mainDocNodeRef){
            var requestConfig = { 
                url: "/alfresco/service/api/version?nodeRef=" + mainDocNodeRef,
                method: "GET"
            };
            
            return $http(requestConfig).then(function(response){
                return response.data;
            });
        }
        
        function uploadDocumentNewVersion(mainDocNodeRef, documentFile){
            var uploadProps = {
                updateNodeRef: mainDocNodeRef,
                overwrite: true
            };
            return alfrescoUploadService.uploadFile(documentFile, null, uploadProps);
        }
    }
})();
