
angular
        .module('openeApp.contacts')
        .controller('OrganizationFilesController', OrganizationFilesController);
function OrganizationFilesController($scope, $stateParams, $mdDialog, $controller, filesService) {
    var vm = this;
    angular.extend(vm, $controller('FilesController', {$scope: $scope}), {
        loadList: loadOrganizationFiles,
        showAddFileDialog: showAddFileDialog,
        showHeader: true,
        disableEditActions: true,
        columns: {
            title: true,
            comment: true,
            created: true,
            creator: false,
            modified: false,
            modifier: false,
            action: true
        }
    });
    vm.loadList();

    function showAddFileDialog(ev) {
        $mdDialog.show({
            controller: 'AddFileDialogController',
            controllerAs: 'addFileVm',
            templateUrl: 'app/src/files/view/addFiles.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                filesAddDialogService: {
                    hideOwner: true,
                    addFiles: addFiles
                }
            }
        }).then(vm.loadList);
    }

    function addFiles(model) {
        var organizationNodeRef = $stateParams.storeProtocol + "://" + $stateParams.storeIdentifier + "/" + $stateParams.uuid;
        return filesService.uploadFiles(organizationNodeRef, model.files, model.comment);
    }

    function loadOrganizationFiles() {
        filesService.getFiles($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(files) {
            vm.files = files;
        });
    }
}