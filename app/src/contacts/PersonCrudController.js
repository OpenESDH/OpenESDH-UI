(function() {

    angular
            .module('openeApp.contacts')
            .controller('PersonCrudController', PersonCrudController);

    PersonCrudController.$inject = ['$stateParams', 'contactsService'];

    function PersonCrudController($stateParams, contactsService) {
        var vm = this;
        vm.person = [];
        vm.success = null;
        vm.error = null;
        vm.doSave = doSave;

        initInfo();

        function initInfo() {
            if ($stateParams.uuid) {
                contactsService.getPerson($stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid).then(function(response) {
                    vm.person = response;
                    console.log(vm.person);
                });
            }
        }

        function doSave(personForm) {
            vm.error = null;
            vm.success = null;
            if (!personForm.$valid) {
                vm.error = 'Fill all required fields!';
                return;
            }
            if ($stateParams.uuid) {
                contactsService.updatePerson(
                        $stateParams.storeProtocol, $stateParams.storeIdentifier, $stateParams.uuid, vm.person)
                        .then(refreshInfoAfterSuccess, saveError);
            } else {
                contactsService.createPerson(vm.person)
                        .then(refreshInfoAfterSuccess, saveError);
            }
        }

        function refreshInfoAfterSuccess(savedPerson) {
            vm.person = savedPerson;
            vm.success = 'Success!';
        }

        function saveError(response) {
            console.log(response);
            vm.error = response.statusText || response.message;
        }
    }
})();
