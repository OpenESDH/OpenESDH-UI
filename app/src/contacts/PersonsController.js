angular
        .module('openeApp.contacts')
        .controller('PersonsController', PersonsController);

function PersonsController($stateParams, contactsService, oeParametersService,
        notificationUtilsService, VirtualRepeatLoader, personDialogService) {
    var vm = this;
    vm.showPersonEdit = showPersonEdit;

    vm.allowNewContacts = false;
    oeParametersService.getParameter('can_create_contacts').then(function(value) {
        vm.allowNewContacts = value;
    });

    vm.dataLoader = new VirtualRepeatLoader(loadPersons, error);

    function loadPersons(query, params) {
        if ($stateParams.uuid) {
            return contactsService.getAssociations($stateParams.storeProtocol + "://" + $stateParams.storeIdentifier + "/" + $stateParams.uuid)
                    .then(function(result) {
                        return {
                            items: result
                        };
                    });
        }
        return contactsService.getPersons(query, params).then(function(result) {
            return result;
        });
    }

    function showPersonEdit(ev, person, organization) {
        personDialogService
                .showPersonEdit(ev, person, organization)
                .then(function() {
                    vm.dataLoader.refresh();
                });
    }

    function error(response) {
        notificationUtilsService.alert(response.data.message);
    }
}