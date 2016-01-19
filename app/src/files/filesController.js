
angular
        .module('openeApp.files')
        .controller('filesController', FilesController);

function FilesController(filesService, $translate, $mdDialog, notificationUtilsService,
        alfrescoDownloadService, documentPreviewService, userService) {
    var vm = this;
    vm.tab = 'my_files';
    vm.files = [];
    vm.loadList = loadList;
    vm.showAddFileDialog = showAddFileDialog;
    vm.downloadFile = downloadFile;
    vm.previewFile = previewFile;
    vm.deleteFile = deleteFile;
    vm.assignFile = assignFile;
    loadList();
    function loadList() {
        vm.files = [];
        var listF = vm.tab === 'my_files'
                ? filesService.getUserFiles
                : filesService.getGroupFiles;
        listF().then(function(files) {
            vm.files = files;
        }, function(error) {
            notificationUtilsService.alert(error.data.message || 'Unexpected exception');
            console.log(error);
        });
    }

    function downloadFile(file) {
        alfrescoDownloadService.downloadFile(file.nodeRef, file.name);
    }

    function previewFile(file) {
        documentPreviewService.previewDocument(file.nodeRef);
    }

    function deleteFile(file) {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('FILE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_FILE', {title: file.title}))
                .ariaLabel('File delete confirmation')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            filesService.deleteFile(file.nodeRef)
                    .then(function() {
                        loadList();
                        notificationUtilsService.notify($translate.instant('FILE.DELETE_FILE_SUCCESS'));
                    }, function(response) {
                        console.log(response);
                        notificationUtilsService.alert($translate.instant('FILE.DELETE_FILE_FAILURE'));
                    });
        });
    }

    function showAddFileDialog(ev) {
        userService.getAuthorities().then(function(authorities) {
            $mdDialog.show({
                controller: AddFileDialogController,
                controllerAs: 'addFileVm',
                templateUrl: '/app/src/files/view/addFiles.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    authorities: authorities
                }
            }).then(function() {
                loadList();
            });
        });
    }

    function AddFileDialogController($mdDialog, authorities) {
        var addFileVm = this;
        addFileVm.authorities = authorities || [];
        addFileVm.owner = null;
        addFileVm.file = null;
        addFileVm.addFiles = addFiles;
        addFileVm.hide = hide;
        addFileVm.cancel = cancel;
        function addFiles() {
            filesService.uploadFile(addFileVm.owner, addFileVm.file)
                    .then(function() {
                        notificationUtilsService.notify($translate.instant("FILE.FILE_UPLOADED_SUCCESSFULLY"));
                        hide();
                    }, function(response) {
                        notificationUtilsService.alert(response.data.message || 'Unexpected exception');
                    });
        }

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

    function assignFile(ev, file) {
        userService.getAuthorities().then(function(authorities) {
            $mdDialog.show({
                controller: AssignFileDialogController,
                controllerAs: 'assignFileVm',
                templateUrl: '/app/src/files/view/assignFile.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    authorities: authorities,
                    file: file
                }
            }).then(function() {
                loadList();
            });
        });
    }

    function AssignFileDialogController($mdDialog, authorities, file) {
        var assignFileVm = this;
        assignFileVm.authorities = authorities || [];
        assignFileVm.owner = null;
        assignFileVm.comment = null;

        assignFileVm.assignFile = assignFile;
        assignFileVm.hide = hide;
        assignFileVm.cancel = cancel;

        function assignFile() {
            filesService.moveFile(file.nodeRef, assignFileVm.owner.nodeRef, assignFileVm.comment)
                    .then(function() {
                        notificationUtilsService.notify($translate.instant("FILE.FILE_ASSIGNED_SUCCESSFULLY",
                                {title: file.name, authorityName: assignFileVm.owner.name}));
                        hide();
                    }, function(response) {
                        notificationUtilsService.alert(response.data.message || 'Unexpected exception');
                    });
        }

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}
