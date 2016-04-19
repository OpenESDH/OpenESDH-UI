
angular
        .module('openeApp.files')
        .controller('AddFileDialogController', AddFileDialogController);


function AddFileDialogController($mdDialog, notificationUtilsService, $translate, params) {
    var addFileVm = this;
    addFileVm.params = params;
    addFileVm.model = {
        files : null,
        comment : null
    };
    
    addFileVm.addFiles = addFiles;
    addFileVm.cancel = cancel;
    
    function addFiles(){
        return addFileVm.params.addFiles(addFileVm.model).then(function() {
                    if (addFileVm.model.files.length > 1) {
                        notificationUtilsService.notify($translate.instant("FILE.N_FILES_UPLOADED_SUCCESSFULLY", {'n': addFileVm.model.files.length}));
                    } else {
                        notificationUtilsService.notify($translate.instant("FILE.FILE_UPLOADED_SUCCESSFULLY", {'title': addFileVm.model.files[0].name}));
                    }
                    $mdDialog.hide();
                });
    }

    function cancel() {
        $mdDialog.cancel();
    }
}
