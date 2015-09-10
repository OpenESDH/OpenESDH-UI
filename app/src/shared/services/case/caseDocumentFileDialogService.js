(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('caseDocumentFileDialogService', CaseDocumentFileDialogService);

    CaseDocumentFileDialogService.$inject = ['$mdDialog', 'caseDocumentsService'];

    function CaseDocumentFileDialogService($mdDialog, caseDocumentsService) {
        var service = {
                uploadNewCaseDocument: uploadNewCaseDocument,
                documentConstraints: null,
                _showDialog: _showDialog,
                _loadDocumentConstraints: _loadDocumentConstraints
        };
        
        return service;
        
        function uploadNewCaseDocument(caseId, callback){
            var _this = this;
            this._loadDocumentConstraints();
            caseDocumentsService.getDocumentsFolderNodeRef(caseId).then(function(res){
                _this._showDialog(res.caseDocsFolderNodeRef, callback);
            });
        }
        
        function _loadDocumentConstraints(){
            var _this = this;
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                _this.documentConstraints = documentConstraints;
            });
        }
        
        function _showDialog(caseDocsFolderNodeRef, callback){
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/shared/services/case/view/caseDocumentDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: {
                    documentConstraints: this.documentConstraints 
                }
            })
            .then(function(fileToUpload, documentProperties) {
                if(!fileToUpload){
                    return;
                }
                caseDocumentsService.uploadCaseDocument(fileToUpload, caseDocsFolderNodeRef, documentProperties).then(function(result){
                    if(callback){
                        callback();
                    }
                });
            }, function() {
                //on cancel dialog
            });
        }
        
        function DialogController($scope, $mdDialog, documentConstraints) {
            
            $scope.documentConstraints = documentConstraints;
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.upload = function(){
                var props = {
                    doc_category: $scope.documentCategory,
                    doc_state: $scope.documentState,
                    doc_type: $scope.documentType
                };
                $mdDialog.hide($scope.fileToUpload, props);
            };
        }
    }

})();