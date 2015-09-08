(function() {

    angular
            .module('openeApp.contacts')
            .controller('PersonsController', PersonsController);

    PersonsController.$inject = ['contactsService'];

    function PersonsController(contactsService) {
        var vm = this;
        vm.persons = [];
        vm.doFilter = doFilter;

        initList();

        function initList() {
            contactsService.getPersons(vm.searchQuery || '').then(function(response) {
                vm.persons = response;
            }, function(error) {
                console.log(error);
            });
        }

        function doFilter() {
            initList();
        }
    }
})();
