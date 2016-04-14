
angular
        .module('openeApp.contacts')
        .controller('OrganizationController', OrganizationController);

function OrganizationController($filter, $stateParams, $state, $mdDialog, $location, $translate, $timeout, VirtualRepeatLoader,
        contactsService, notificationUtilsService, organizationDialogService) {
    var vm = this;
    vm.parentState = $state.current.name.split('.')[0];
    vm.showOrganizationEdit = showOrganizationEdit;
    vm.deleteOrganization = deleteOrganization;
    vm.filterArray = {};
    vm.columnFilter = columnFilter;
    vm.organizations = [];
    vm.loadOrganizations = loadOrganizations;

    if ($stateParams.uuid) {
        //infoForm
        initInfo();
    } else {
        //list
        vm.loadOrganizations();
    }

    function loadOrganizations(){
        contactsService.getOrganizations(vm.searchQuery).then(function(result){
            vm.organizations = result.items;
        });
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
                        $timeout(function(){vm.loadOrganizations()}, 2000);
                    }
                });
    }

    function error(error) {
        if (error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
    
    function columnFilter(item) {
        
        var textFilters = ['organizationName', 'department', 'address', 'cityName'];
        
        for(var i=0; i<textFilters.length; i++){
            var filter = textFilters[i];
            if (textFilterNoMatch(filter, item)) {
                return;
            }    
        }
        
        if (vm.filterArray.cvrNumber !== undefined) {
            var searchText = new RegExp(vm.filterArray.cvrNumber, "i");
            var cvrNumber = "" + item.cvrNumber;
            if (cvrNumber.search(searchText) != 0)
                return;
        }
                
        if (vm.filterArray.postCode !== undefined) {
            var searchText = new RegExp(vm.filterArray.postCode, "i");
            var postCode = "" + item.postCode;
            if (postCode.search(searchText) != 0)
                return;
        }
        
        if (vm.filterArray.countryName !== undefined && vm.filterArray.countryName.length > 0) {
            var searchText = new RegExp(vm.filterArray.countryName, "i");
            var countryName = $filter('countryCodeToName')(item.countryCode);
            if (countryName == undefined || countryName.search(searchText) != 0)
                return;
        }

        return item;
    }
    
    function textFilterNoMatch(filter, item){
        if (vm.filterArray[filter] !== undefined && vm.filterArray[filter].length > 0) {
            var searchText = new RegExp(vm.filterArray[filter], "i");
            var value = item[filter]; 
            if (value == undefined || value.search(searchText) < 0)
                return true;
        }
        return false;
    }
}