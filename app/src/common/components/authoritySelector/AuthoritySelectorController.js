
angular
        .module('openeApp')
        .controller('AuthoritySelectorController', AuthoritySelectorController);

function AuthoritySelectorController(userService) {
    var vm = this;
    vm.authorities = [];
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    loadAuthorities();
    
    function loadAuthorities() {
        return userService.getAuthorities().then(function(response) {
            vm.authorities = response;
        });
    }

    function selectedItemChange(item) {
        vm.datasource = item ? item.nodeRef : '';
    }

    function querySearch(query) {
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