
angular
        .module('openeApp.files')
        .controller('FilesController', FilesController);

function FilesController(filesService, $translate, $mdDialog, notificationUtilsService,
        alfrescoDownloadService, documentPreviewService) {
    var vm = this;
    vm.tab = 'my_files';
    vm.files = [];
    vm.loadList = loadList;
    vm.showAddFileDialog = showAddFileDialog;
    vm.downloadFile = downloadFile;
    vm.previewFile = previewFile;
    vm.deleteFile = deleteFile;
    vm.assignFile = assignFile;
    vm.addToCase = addToCase;
    vm.showComments = showComments;
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
        alfrescoDownloadService.downloadFile(file.nodeRef, file.title);
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
        $mdDialog.show({
            controller: 'AddFileDialogController',
            controllerAs: 'addFileVm',
            templateUrl: 'app/src/files/view/addFiles.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        }).then(function() {
            loadList();
        });
    }

    function assignFile(ev, file) {
        $mdDialog.show({
            controller: 'AssignFileDialogController',
            controllerAs: 'assignFileVm',
            templateUrl: 'app/src/files/view/assignFile.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                file: file
            }
        }).then(function() {
            loadList();
        });
    }

    function addToCase(ev, file) {
        $mdDialog.show({
            controller: 'AddFileToCaseDialogController',
            controllerAs: 'addToCaseVm',
            templateUrl: 'app/src/files/view/addFileToCase.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                file: file
            }
        }).then(function() {
            loadList();
        });
    }
    
    function showComments(ev, file){
        $mdDialog.show({
            controller: 'FileCommentsDialogController',
            controllerAs: 'fileCommentsVm',
            templateUrl: 'app/src/files/view/fileComments.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                file: file
            }
        }).then(function() {
        });
    }
}
