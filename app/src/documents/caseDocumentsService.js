
    angular
        .module('openeApp.documents')
        .factory('caseDocumentsService', CaseDocumentsService);

    function CaseDocumentsService($http, $q, httpUtils, alfrescoUploadService, alfrescoNodeUtils) {
        var service = {
            getDocsFolderContents: getDocsFolderContents,
            getDocsFolderPath: getDocsFolderPath,
            getDocumentsByCaseId: getDocumentsByCaseId,
            uploadCaseDocument: uploadCaseDocument,
            getDocumentsFolderNodeRef: getDocumentsFolderNodeRef,
            getCaseDocumentsWithAttachments: getCaseDocumentsWithAttachments,
            getCaseDocumentConstraints: getCaseDocumentConstraints,
            getDocumentsFolderNodeRefByCaseRef: getDocumentsFolderNodeRefByCaseRef
        };
        return service;
        
        function getDocsFolderContents(nodeRef){
            var request = { 
                url: '/api/openesdh/case/docs/folder/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/contents',
                method: "GET"
            };
            return $http(request).then(function(response){
                return {
                    documents: response.data,
                };
            });
        }
        
        function getDocsFolderPath(nodeRef){
            return $http.get('/api/openesdh/case/docs/folder/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/path').then(function(result){
                return result.data;
            });
        }
        
        function getDocumentsByCaseId(caseId){
            return getDocumentsFolderNodeRef(caseId).then(function(result){
                return getDocsFolderContents(result.caseDocsFolderNodeRef).then(function(result){
                    result.documents = result.documents.filter(function(item){
                        return !item.folder;
                    });
                    return result;
                });
            });
        }
        
        function getDocumentsFolderNodeRef(caseId){
            var requestConfig = { 
                    url: "/api/openesdh/case/" + caseId + "/docfolder/noderef",
                    method: "GET"
                };
            return $http(requestConfig).then(function(response){
                return response.data;
            });
        }
        
        function getDocumentsFolderNodeRefByCaseRef(nodeRef){
            var requestConfig = { 
                    url: "/api/openesdh/case/" + nodeRef + "/docfolder/noderef",
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
                url: "/api/openesdh/case/" + caseId + "/documents/attachments",
                method: "GET"
            };
            return $http(requestConfig).then(function(response){
                return response.data;
            });
        }
        
        function getCaseDocumentConstraints(){
            return $http.get("/api/openesdh/case/document/constraints").then(function(response){
               return response.data; 
            });
        }
    }