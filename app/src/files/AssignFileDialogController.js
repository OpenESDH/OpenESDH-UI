
angular
        .module('openeApp.files')
        .controller('AssignFileDialogController', AssignFileDialogController);

function AssignFileDialogController($mdDialog, $translate, filesService, notificationUtilsService, authorities, file) {
    var assignFileVm = this;
    assignFileVm.authorities = authorities || [];
    assignFileVm.owner = null;
    assignFileVm.comment = null;

    assignFileVm.assignFile = assignFile;
    assignFileVm.cancel = cancel;

    function assignFile() {
        filesService.moveFile(file.nodeRef, assignFileVm.owner.nodeRef, assignFileVm.comment)
                .then(function() {
                    notificationUtilsService.notify($translate.instant("FILE.FILE_ASSIGNED_SUCCESSFULLY",
                            {title: file.title, authorityName: assignFileVm.owner.name}));
                    $mdDialog.hide();
                }, function(response) {
                    notificationUtilsService.alert(response.data.message || 'Unexpected exception');
                });
    }

    function cancel() {
        $mdDialog.cancel();
    }
}