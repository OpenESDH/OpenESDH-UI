    angular
        .module('openeApp.documents')
        .controller('NewCaseDocumentDialogController', NewCaseDocumentDialogController);
    
    function NewCaseDocumentDialogController($scope, $mdDialog, caseDocumentsService, fromFileObject) {
        
        loadDocumentConstraints($scope);

        $scope.$watch(function (scope) {
            return $scope.fileToUpload;
        }, function (newValue, oldValue) {
            if (typeof newValue !== 'undefined' && newValue != null) {
                // Automatically set the name of the document to the
                // filename, unless the user has already set a name.
                if (typeof $scope.documentProperties.title === 'undefined'
                        || $scope.documentProperties.title == null
                        || $scope.documentProperties.title == "") {
                    $scope.documentProperties.title = newValue.name;
                }
            }
        });

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
        
        function loadDocumentConstraints($scope){
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                $scope.documentConstraints = documentConstraints;
            });
        }
    }