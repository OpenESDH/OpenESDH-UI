(function() {
    'use strict';

    angular
        .module('openeApp.documents')
        .factory('caseDocumentsService', CaseDocumentsService);

    CaseDocumentsService.$inject = ['$http', 'httpUtils', 'alfrescoUploadService'];

    function CaseDocumentsService($http, httpUtils, alfrescoUploadService) {
        var service = {
            getDocumentsByCaseId: getDocumentsByCaseId,
            uploadCaseDocument: uploadCaseDocument,
            getDocumentsFolderNodeRef: getDocumentsFolderNodeRef,
            getCaseDocumentsWithAttachments: getCaseDocumentsWithAttachments,
            getCaseDocumentConstraints: getCaseDocumentConstraints
        };
        return service;
        
        function getDocumentsByCaseId(caseId, page, pageSize){
             var requestConfig = { 
                 url: "/alfresco/service/api/openesdh/casedocumentssearch?caseId=" + caseId,
                 method: "GET"
             };
             
             httpUtils.setXrangeHeader(requestConfig, page, pageSize);
             
             return $http(requestConfig).then(function(response){
                 return {
                     documents: response.data, 
                     contentRange: httpUtils.parseResponseContentRange(response)
                 };
             });
        }
        
        function getDocumentsFolderNodeRef(caseId){
            var requestConfig = { 
                    url: "/alfresco/service/api/openesdh/case/docfolder/noderef/" + caseId,
                    method: "GET"
                };
            return $http(requestConfig).then(function(response){
                return response.data;
            });
        }
        
        function uploadCaseDocument(documentFile, caseDocumentsFolder, documentProperties){
            var documentProps = documentProperties;
            if(!documentProps){
                documentProps = {
                        doc_category: "annex",
                        doc_type: "invoice"
                };
            }else{
                if(!documentProps.doc_category){
                    documentProps.doc_category = "annex";                    
                }
                if(!documentProps.doc_type){
                    documentProps.doc_type = "invoice";                    
                }
            }
            return alfrescoUploadService.uploadFile(documentFile, caseDocumentsFolder, documentProps);
        }
        
        function getCaseDocumentsWithAttachments(caseId){
            var requestConfig = { 
                url: "/alfresco/service/api/openesdh/case/" + caseId + "/documents/attachments",
                method: "GET"
            };
            return $http(requestConfig).then(function(response){
                return response.data;
            });
        }
        
        function getCaseDocumentConstraints(){
            return $http.get("/alfresco/service/api/openesdh/case/document/constraints").then(function(response){
               return response.data; 
            });
        }
    }
})();
