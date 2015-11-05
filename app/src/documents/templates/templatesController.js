angular
    .module('openeApp.docTemplates')
    .controller('templatesController', TemplatesController);

function TemplatesController($mdDialog, templateService) {
    var vm = this;
    vm.templates = [];

    vm.init = function loadTemplates() {
        alert("Template controller");
    };
    vm.uploadNewTemplate = uploadTemplate;

    function uploadTemplate(){
        showDialog(NewCaseDocumentDialogController).then(function (response) {
            console.log("==> Response from dialog:"+response);
            templateService.uploadTemplate(response).then(function(response){
                console.log("==> Response from dialog Service:"+response);
            });
        });
    }

    function showDialog(controller, locals){
        if(!locals){
            locals = {
                newTemplateVersion: false
            };
        }
        return $mdDialog.show({
            controller: NewCaseDocumentDialogController,
            templateUrl: 'app/src/documents/templates/view/uploadDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            locals: locals,
            focusOnOpen: false
        });
    }

    function NewCaseDocumentDialogController($scope, $mdDialog) {

        $scope.templateProperties = {
            majorVersion: "false"
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.upload = function(){
            var response = {
                fileToUpload: $scope.fileToUpload,
                templateProperties: $scope.templateProperties
            };
            $mdDialog.hide(response);
        };
    }

}
