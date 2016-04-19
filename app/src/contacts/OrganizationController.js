
angular
        .module('openeApp.contacts')
        .controller('OrganizationController', OrganizationController);
function OrganizationController($scope, $stateParams, $state, $mdDialog, $translate,
        contactsService, notificationUtilsService, organizationDialogService, $controller, filesService) {
    var vm = this;
    vm.parentState = $state.current.name.split('.')[0];
    vm.showOrganizationEdit = showOrganizationEdit;
    vm.deleteOrganization = deleteOrganization;
    initInfo();
    initFiles();
    function initInfo() {
        contactsService.getOrganization($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(organization) {
            vm.organization = organization;
        });
    }

    function initFiles() {
        $scope.filesVm = {};
        angular.extend($scope.filesVm, $controller('FilesController', {$scope: $scope}), {
            loadList: loadOrganizationFiles,
            showAddFileDialog: showAddFileDialog,
            showHeader: true,
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
        $scope.filesVm.loadList();
    }

    function showAddFileDialog(ev) {
        $mdDialog.show({
            controller: 'AddFileDialogController',
            controllerAs: 'addFileVm',
            templateUrl: 'app/src/files/view/addFiles.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                params: {
                    hideOwner: true,
                    addFiles: addFiles
                }
            }
        }).then($scope.filesVm.loadList);
    }
    
    function addFiles(model) {
        return filesService.uploadFiles(vm.organization.nodeRefId, model.files, model.comment);
    }

    function showOrganizationEdit(ev) {
        organizationDialogService.showOrganizationEdit(ev, vm.organization)
                .then(function(response) {
                    vm.organization = response;
                });
    }

    function deleteOrganization(ev, organization) {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('ORG.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ORG', organization))
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            contactsService.deleteOrganization(organization).then(function() {
                $state.go(vm.parentState + ".organizations");
                notificationUtilsService.notify($translate.instant("ORG.ORG_DELETED_SUCCESSFULLY", organization));
            }, error);
        });
    }

    function loadOrganizationFiles() {
        filesService.getFiles($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(files) {
            $scope.filesVm.files = files;
        });
    }

    function error(error) {
        if (error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
}