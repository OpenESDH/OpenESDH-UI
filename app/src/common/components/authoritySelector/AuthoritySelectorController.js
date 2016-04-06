
angular
        .module('openeApp')
        .controller('AuthoritySelectorController', AuthoritySelectorController);

function AuthoritySelectorController(userService, $q) {
    var vm = this;
    vm.authorities = [];
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.initialised = initialised;
    
    var defer = $q.defer();
    
    loadAuthorities();
    
    function loadAuthorities() {
        return userService.getAuthorities().then(function(response) {
            vm.authorities = response;
            defer.resolve(vm);
        });
    }
    
    function initialised(){
        return defer.promise;
    }

    function selectedItemChange(item) {
        var vm = this;
        vm.datasource = item ? item.nodeRef : '';
    }

    function querySearch(query) {
        var vm = this;
        var results = query ? vm.authorities.filter(createFilterFor(query)) : vm.authorities;
        return results;
    }

    /*
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.name.toLowerCase().indexOf(lowercaseQuery) > -1);
        };
    }
}