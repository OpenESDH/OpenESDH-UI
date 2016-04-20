
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
        $scope.filesVm = $controller('OrganizationFilesController', {$scope: $scope});
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

    function error(error) {
        if (error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
}