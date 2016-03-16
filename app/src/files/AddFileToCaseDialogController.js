
angular
        .module('openeApp.files')
        .controller('AddFileToCaseDialogController', AddFileToCaseDialogController);

function AddFileToCaseDialogController($mdDialog, $scope, $translate,
        caseService, caseDocumentsService, filesService, notificationUtilsService, file) {
    var addToCaseVm = this;
    addToCaseVm.selectedCase;

    addToCaseVm.execute = execute;
    addToCaseVm.cancel = cancel;

    addToCaseVm.caseSearch = caseService.caseSearch;

    $scope.documentProperties = {
        title: file.cm.title,
        doc_type: null,
        doc_category: null,
        description: null
    };

    caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints) {
        $scope.documentConstraints = documentConstraints;
    });

    function execute() {
        filesService.addFileToCase(
                addToCaseVm.selectedCase['oe:id'],
                file.nodeRef,
                $scope.documentProperties)
                .then(function() {
                    notificationUtilsService.notify($translate.instant("FILE.FILE_ADDED_TO_CASE_SUCCESSFULLY",
                            {title: $scope.documentProperties.title, caseId: addToCaseVm.selectedCase['oe:id']}));
                    $mdDialog.hide();
                }, function(response) {
                    notificationUtilsService.alert(response.data.message || 'Unexpected exception');
                });
    }

    function cancel() {
        $mdDialog.cancel();
    }
}
