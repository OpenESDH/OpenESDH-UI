
angular
        .module('openeApp.contacts')
        .controller('OrganizationController', OrganizationController);

function OrganizationController($stateParams, $state, $mdDialog, $location, $translate, $timeout, VirtualRepeatLoader,
        contactsService, notificationUtilsService, organizationDialogService) {
    var vm = this;
    vm.parentState = $state.current.name.split('.')[0];
    vm.showOrganizationEdit = showOrganizationEdit;
    vm.deleteOrganization = deleteOrganization;

    if ($stateParams.uuid) {
        //infoForm
        initInfo();
    } else {
        //list
        initList();
    }

    function initList() {
        vm.dataLoader = new VirtualRepeatLoader(contactsService.getOrganizations, error);
    }

    function initInfo() {
        contactsService.getOrganization($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(organization) {
            vm.organization = organization;
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

    function showOrganizationEdit(ev) {
        organizationDialogService.showOrganizationEdit(ev, vm.organization)
                .then(function(response) {
                    if (vm.organization) {
                        vm.organization = response;
                    } else {
                        $timeout(vm.dataLoader.refresh, 2000);
                    }
                });
    }

    function error(error) {
        if (error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
}