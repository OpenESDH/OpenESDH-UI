
    angular
        .module('openeApp.documents')
        .factory('caseDocumentFileDialogService', CaseDocumentFileDialogService);

    function CaseDocumentFileDialogService($mdDialog, $q, caseDocumentsService, caseDocumentDetailsService) {
        var service = {
                uploadCaseDocument: uploadCaseDocument,
                uploadCaseDocumentNewVersion: uploadCaseDocumentNewVersion,
                uploadAttachment: uploadAttachment,
                uploadAttachmentNewVersion: uploadAttachmentNewVersion,
                editDocumentProperties: editDocumentProperties
        };
        
        return service;
        
        function uploadCaseDocument(caseId, fileObject){
            return $q(function(resolve, reject){
                var fromFileObject = typeof fileObject !== "undefined" && fileObject instanceof Blob;
                showDialog(NewCaseDocumentDialogController, {
                    fromFileObject: fromFileObject
                }).then(function(formData) {
                    
                    if(!formData.fileToUpload && !fromFileObject){
                        return;
                    }

                    if (fromFileObject) {
                        formData.fileToUpload = fileObject;
                    }
                    
                    caseDocumentsService.getDocumentsFolderNodeRef(caseId).then(function(res){
                        caseDocumentsService.uploadCaseDocument(formData.fileToUpload, res.caseDocsFolderNodeRef, formData.documentProperties).then(function(result){
                            resolve(result);
                        });
                    });
                    
                });
            });
        }
        
        function uploadCaseDocumentNewVersion(documentNodeRef){
            return $q(function(resolve, reject){
                caseDocumentDetailsService.getCaseDocument(documentNodeRef).then(function(document){
                    showDialog(CaseDocumentNewVersionDialogController, {document: document}).then(function(formData) {
                        
                        if(!formData.fileToUpload){
                            return;
                        }
                        
                        caseDocumentDetailsService.uploadDocumentNewVersion(document.mainDocNodeRef, formData.fileToUpload, formData.documentProperties).then(function(result){
                            resolve(result);
                        });
                        
                    });
                });
            });
        }
        
        function uploadAttachment(documentNodeRef){
            return $q(function(resolve, reject){
                showDialog(CaseDocumentAttachmentDialogController, {isNewVersion: false}).then(function(formData) {
                    
                    if(!formData.fileToUpload){
                        return;
                    }
                    
                    caseDocumentDetailsService.uploadDocumentAttachment(documentNodeRef, formData.fileToUpload, formData.documentProperties).then(function(result){
                        resolve(result); 
                    });
                    
                });
            });
        }
        
        function uploadAttachmentNewVersion(attachmentNodeRef){
            return $q(function(resolve, reject){
                showDialog(CaseDocumentAttachmentDialogController, {isNewVersion: true}).then(function(formData) {
                    
                    if(!formData.fileToUpload){
                        return;
                    }
                    
                    caseDocumentDetailsService.uploadAttachmentNewVersion(attachmentNodeRef, formData.fileToUpload, formData.documentProperties).then(function(result){
                        resolve(result); 
                    });
                    
                });
            });
        }
        
        function editDocumentProperties(documentNodeRef){
            return $q(function(resolve, reject){
                caseDocumentDetailsService.getCaseDocument(documentNodeRef).then(function(document){
                    showDialog(CaseDocumentEditPropertiesDialogController, {document: document}).then(function(formData) {
                        var updatedDocument = {
                                nodeRef: documentNodeRef,
                                title: formData.title,
                                type: formData.doc_type,
                                category: formData.doc_category
                        };
                        
                        caseDocumentDetailsService.updateDocumentProperties(updatedDocument).then(function(result){
                            resolve(result);
                        });
                        
                    });
                });
            });
        }
        
        function showDialog(controller, locals){
            if(!locals){
                locals = {};
            }
            return $mdDialog.show({
                controller: controller,
                templateUrl: 'app/src/documents/view/caseDocumentDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: locals,
                focusOnOpen: false
            });
        }
        
        function NewCaseDocumentDialogController($scope, $mdDialog, fromFileObject) {
            
            loadDocumentConstraints($scope);

            $scope.fromFileObject = fromFileObject;

            $scope.documentProperties = {
                    majorVersion: "false"
            };
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.upload = function(){
                var response = {
                    fileToUpload: $scope.fileToUpload,
                    documentProperties: $scope.documentProperties
                };
                $mdDialog.hide(response);
            };
        }
        
        function CaseDocumentNewVersionDialogController($scope, $mdDialog, document){
            loadDocumentConstraints($scope);
            
            $scope.newDocumentVersion = true;
            
            $scope.documentProperties = {
                    doc_type: document.typeId,
                    doc_category: document.categoryId,
                    description: document.description,
                    majorVersion: "false"
            };
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.upload = function(){
                var response = {
                    fileToUpload: $scope.fileToUpload,
                    documentProperties: $scope.documentProperties
                };
                $mdDialog.hide(response);
            };
        }
        
        function CaseDocumentEditPropertiesDialogController($scope, $mdDialog, document){
            loadDocumentConstraints($scope);
            
            $scope.isEditProperties = true;
            
            $scope.documentProperties = {
                    title: document.title,
                    doc_type: document.typeId,
                    doc_category: document.categoryId,
                    description: document.description
            };
            
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
          
            $scope.upload = function(){
                $mdDialog.hide($scope.documentProperties);
            };
        }
        
        function CaseDocumentAttachmentDialogController($scope, $mdDialog, isNewVersion){
            $scope.newDocumentVersion = isNewVersion;
            $scope.isAttachment = true;
            $scope.documentProperties = {
                    majorVersion: "false"
            };
            
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
              
            $scope.upload = function(){
                var response = {
                    fileToUpload: $scope.fileToUpload,
                    documentProperties: $scope.documentProperties
                };
                $mdDialog.hide(response);
            };
        }
        
        function loadDocumentConstraints($scope){
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                $scope.documentConstraints = documentConstraints;
            });
        }
    }
