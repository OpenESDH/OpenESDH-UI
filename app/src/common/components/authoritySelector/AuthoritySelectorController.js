
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

    initialised().then(setInitialModelValue);

    function loadAuthorities() {
        return userService.getAuthorities().then(function(response) {
            vm.authorities = response;
            if (vm.removeItem) {
                vm.authorities = vm.authorities.filter(function(item) {
                    return item.shortName !== vm.removeItem;
                });
            }
            defer.resolve(vm);
        });
    }

    function initialised() {
        return defer.promise;
    }

    function setInitialModelValue() {
        if (vm.datasource) {
            vm.authorities.filter(function(item) {
                return item.nodeRef === vm.datasource;
            }).map(function(item) {
                vm.selected = item.name;
            });
        }
    }

    function selectedItemChange(item) {
        var vm = this;
        vm.datasource = item ? item.nodeRef : '';
    }

    function querySearch(query) {
        var vm = this;
        if (query) {
            return vm.authorities.filter(createFilterFor(query));
        }
        vm.datasource = '';//fix for deleting selected item
        return vm.authorities;
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