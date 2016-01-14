
    angular
        .module('openeApp.officeTemplates')
        .controller('OfficeTemplateController', OfficeTemplateController);

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function OfficeTemplateController($scope, $mdDialog, $translate, officeTemplateService, FileSaver, Blob, ContextService) {
        var vm = this;

        vm.getTemplates = getTemplates;
        vm.deleteTemplate = deleteTemplate;
        vm.getTemplate = getTemplate;
        vm.getThumbnail = getThumbnail;
        vm.fillTemplate = fillTemplate;
        vm.getFileExtension = getFileExtension;
        vm.uploadNewTemplate = uploadTemplate;

        activate();

        function activate() {
            getTemplates();
            ContextService.setContext('templates');
        }

        function getTemplates() {
            return officeTemplateService.getTemplates().then(function(templates) {
                vm.templates = templates;
            });
        }

        function getThumbnail(nodeRef) {
            return officeTemplateService.getCardViewThumbnail(nodeRef);
        }

        function getFileExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        }

        function deleteTemplate(ev, template) {
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('DOCUMENT.TEMPLATE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_TEMPLATE', {title: template.title}))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            
            $mdDialog.show(confirm).then(function() {
                officeTemplateService.deleteTemplate(template.nodeRef).then(function(response) {
                    return getTemplates();
                });
            });
            ev.stopPropagation();
        }

        function getTemplate(nodeRef) {
            return officeTemplateService.getTemplate(nodeRef).then(function(template) {
                return template;
            });
        }

        function fillTemplate(template, fieldData) {
            officeTemplateService.fillTemplate(template.nodeRef, fieldData).then(function (blob) {
                FileSaver.saveAs(
                    blob,
                    template.name.split('.').slice(0, -1).join(".") + ".pdf"
                );
            });
        }

        function uploadTemplate(){
            showDialog(NewCaseDocumentDialogController).then(function (response) {
                console.log("==> Response from dialog:", response);
                officeTemplateService.uploadTemplate(response).then(function(response) {
                    console.log("==> Response from dialog Service:", response);
                    return getTemplates();
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
                templateUrl: 'app/src/officeTemplates/view/uploadDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: locals
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