angular
        .module('openeApp.contacts')
        .controller('PersonsController', PersonsController);

function PersonsController($stateParams, $state, $filter, contactsService, notificationUtilsService, personDialogService) {
    var vm = this;
    vm.persons = [];
    vm.showPersonEdit = showPersonEdit;
    vm.loadPersons = loadPersons;
    vm.filterArray = {};
    vm.columnFilter = columnFilter;
    
    vm.loadPersons();

    function loadPersons() {
        var query = vm.searchQuery;
        if ($stateParams.uuid) {
            return contactsService.getAssociations($stateParams.storeProtocol + "://" + $stateParams.storeIdentifier + "/" + $stateParams.uuid)
                    .then(function(result) {
                        vm.persons = result;
                    });
        }
        return contactsService.getPersons(query).then(function(result) {
            vm.persons = result.items;
        });
    }

    function showPersonEdit(ev, person, organization) {
        personDialogService
                .showPersonEdit(ev, person, organization)
                .then(function() {
                    vm.loadPersons();
                });
    }

    function error(error) {
        if (error.domain) {
            notificationUtilsService.alert(error.message);
        }
    }
    
    function columnFilter(item) {
        
        var textFilters = ['firstName', 'lastName', 'address', 'cityName'];
        
        for(var i=0; i<textFilters.length; i++){
            var filter = textFilters[i];
            if (textFilterNoMatch(filter, item)) {
                return;
            }    
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