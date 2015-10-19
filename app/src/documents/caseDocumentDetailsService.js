
    angular
        .module('openeApp.documents')
        .factory('caseDocumentDetailsService', CaseDocumentDetailsService);

    function CaseDocumentDetailsService($http, httpUtils, alfrescoUploadService, alfrescoDownloadService, alfrescoNodeUtils) {
        var service = {
            getCaseDocument: getCaseDocument,
            getDocumentVersionInfo: getDocumentVersionInfo,
            uploadDocumentNewVersion: uploadDocumentNewVersion,
            downloadDocument: downloadDocument,
            getDocumentAttachments: getDocumentAttachments,
            uploadDocumentAttachment: uploadDocumentAttachment,
            uploadAttachmentNewVersion: uploadAttachmentNewVersion,
            downloadAttachment: downloadAttachment,
            updateDocumentProperties: updateDocumentProperties,
            changeDocumentStatus: changeDocumentStatus
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
        
        function uploadDocumentNewVersion(mainDocNodeRef, documentFile, docProps){
            var uploadProps = {
                updateNodeRef: mainDocNodeRef,
                overwrite: true
            };
            if(docProps){
                angular.extend(uploadProps, docProps);
            }
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
        
        function uploadDocumentAttachment(docRecordNodeRef, attachmentFile, props){
            return alfrescoUploadService.uploadFile(attachmentFile, docRecordNodeRef, props);
        }
        
        function uploadAttachmentNewVersion(attachmentNodeRef, attachmentFile, props){
            var uploadProps = {
                updateNodeRef: attachmentNodeRef,
                overwrite: true
            };
            if(props){
                angular.extend(uploadProps, props);
            }
            return alfrescoUploadService.uploadFile(attachmentFile, null, uploadProps);
        }
        
        function downloadAttachment(attachment){
            alfrescoDownloadService.downloadFile(attachment.nodeRef, attachment.name);
        }
        
        function updateDocumentProperties(document){
            var url = "/alfresco/service/api/openesdh/case/document/properties";
            return $http.post(url, document).then(function(response){
                return response;
            });
        }

        function changeDocumentStatus(documentNodeRef, status) {
            return $http.post('/alfresco/service/api/openesdh/documents/' + alfrescoNodeUtils.processNodeRef(documentNodeRef).uri + '/status', {status: status}).then(function (response) {
                return response.data;
            });
        }
    }