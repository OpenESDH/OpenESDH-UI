    angular
        .module('openeApp.systemsettings')
        .controller('PartyRolesController', PartyRolesController);

    function PartyRolesController($controller, partyRolesService) {
        angular.extend(this, $controller('ClassifierValuesController', {classifierValuesService: partyRolesService}));
        var vm = this;
        vm.deleteConfirmMessage = 'PARTY_ROLES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_PARTY_ROLE_X';
        vm.dialogTitleMessageKey = 'PARTY_ROLES.CREATE_EDIT_PARTY_ROLE';
        vm.newClassifValueMessageKey = 'PARTY_ROLES.CREATE_NEW_PARTY_ROLE';
        
        vm.loadList();
    }