(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('caseDocumentDetailsService', CaseDocumentDetailsService);

    CaseDocumentDetailsService.$inject = ['$http', 'httpUtils', 'alfrescoUploadService', 'alfrescoDownloadService', 'alfrescoNodeUtils'];

    function CaseDocumentDetailsService($http, httpUtils, alfrescoUploadService, alfrescoDownloadService, alfrescoNodeUtils) {
        var service = {
            getCaseDocument: getCaseDocument,
            getDocumentVersionInfo: getDocumentVersionInfo,
            uploadDocumentNewVersion: uploadDocumentNewVersion,
            downloadDocument: downloadDocument,
            getDocumentAttachments: getDocumentAttachments,
            uploadDocumentAttachment: uploadDocumentAttachment
        };
        return service;
        
        function getCaseDocument(documentNodeRef){
             var requestConfig = { 
                 url: "/alfresco/service/api/openesdh/documentInfo/" + alfrescoNodeUtils.processNodeRef(documentNodeRef).uri,
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
        
        function downloadDocument(documentVersion){
            alfrescoDownloadService.downloadFile(documentVersion.nodeRef, documentVersion.name);
        }
        
        function getDocumentAttachments(docRecordNodeRef, page, pageSize){
            var requestConfig = { 
                url: "/alfresco/service/api/openesdh/case/document/attachments/versions?nodeRef=" + docRecordNodeRef,
                method: "GET"
            };
            httpUtils.setXrangeHeader(requestConfig, page, pageSize);
            return $http(requestConfig).then(function(response){
                return {
                    resultList: response.data, 
                    contentRange: httpUtils.parseResponseContentRange(response)
                };
            });
        }
        
        function uploadDocumentAttachment(docRecordNodeRef, attachmentFile){
            return alfrescoUploadService.uploadFile(attachmentFile, docRecordNodeRef);
        }
    }
})();
