
angular
        .module('openeApp.contacts')
        .controller('OrganizationListController', OrganizationListController);

function OrganizationListController($state, $filter, contactsService, organizationDialogService) {
    var vm = this;
    vm.parentState = $state.current.name.split('.')[0];
    vm.showOrganizationEdit = showOrganizationEdit;
    vm.filterArray = {};
    vm.columnFilter = columnFilter;
    vm.organizations = [];
    vm.loadOrganizations = loadOrganizations;

    vm.loadOrganizations();

    function loadOrganizations() {
        contactsService.getOrganizations(vm.searchQuery).then(function(result) {
            vm.organizations = result.items;
        });
    }
    
    function showOrganizationEdit(ev) {
        organizationDialogService.showOrganizationEdit(ev, vm.organization)
                .then(function(response) {
                    vm.organization = response;
                });
    }

    function columnFilter(item) {

        var textFilters = ['organizationName', 'department', 'address', 'cityName'];

        for (var i = 0; i < textFilters.length; i++) {
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

    function textFilterNoMatch(filter, item) {
        if (vm.filterArray[filter] !== undefined && vm.filterArray[filter].length > 0) {
            var searchText = new RegExp(vm.filterArray[filter], "i");
            var value = item[filter];
            if (value == undefined || value.search(searchText) < 0)
                return true;
        }
        return false;
    }
}