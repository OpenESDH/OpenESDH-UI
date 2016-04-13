angular
        .module('openeApp.cases.parties')
        .controller('CasePartiesController', CasePartiesController);

function CasePartiesController($scope, $stateParams, $mdDialog, $filter, $translate,
        personDialogService, organizationDialogService, casePartiesService, partyPermittedRolesService,
        contactsService, notificationUtilsService, alfrescoNodeUtils) {
    var vm = this;
    vm.parties = [];
    vm.roles = [];
    vm.removeParty = removeParty;
    vm.showAddPartiesDialog = showAddPartiesDialog;
    vm.showChangePartyDialog = showChangePartyDialog;
    vm.showPersonReadOnly = showPersonReadOnly;
    vm.layout = 'list';

    init();
    
    function init(){
        partyPermittedRolesService.getRoles().then(function(roles) {
            vm.roles = roles;
        });
        fillList();
    }

    function fillList() {
        vm.parties.length = 0;
        casePartiesService.getCaseParties($stateParams.caseId).then(function(parties) {
            vm.parties = parties;
        });
    }

    function removeParty(ev, party) {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('PARTY.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_PARTY', party.contact))
                .ariaLabel('delete confirmation')
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            casePartiesService.deleteCaseParty($stateParams.caseId, party.nodeRef).then(function(response) {
                //remove from list
                var index = vm.parties.indexOf(party);
                vm.parties.splice(index, 1);
                //notify
                notificationUtilsService.notify($translate.instant("PARTY.PARTY_REMOVED_SUCCESSFULLY"));
            }, showError);
        });
    }

    function showError(error) {
        if (error.domain){
            notificationUtilsService.alert(error.message);
        }
    }

    function showAddPartiesDialog(ev, model) {
        $mdDialog.show({
            controller: AddPartyDialogController,
            controllerAs: "ctrl",
            templateUrl: 'app/src/parties/view/casePartiesAddDialog.html',
            parent: angular.element(document.body),
            focusOnOpen: false,
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                roles: vm.roles,
                model: model
            }
        }).then(function(data) {
            
        });
    }

    function showChangePartyDialog(ev, party) {
        $mdDialog.show({
            controller: ChangePartyDialogController,
            controllerAs: "dlChange",
            templateUrl: 'app/src/parties/view/casePartiesChangeDialog.html',
            parent: angular.element(document.body),
            focusOnOpen: false,
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                party: angular.copy(party),
                roles: vm.roles
            }
        }).then(function(response) {
            //
        });
    }

    function showPersonReadOnly(ev, nodeRef) {
        var nodeRefParts = alfrescoNodeUtils.processNodeRef(nodeRef);
        contactsService.getContact(nodeRefParts.storeType, nodeRefParts.storeId, nodeRefParts.id).then(function(contact) {

            personDialogService
                    .showContactReadOnly(ev, contact)
                    .then(function() {
                        // vm.dataLoader.refresh();
                    });
        });
    }

    function AddPartyDialogController($mdDialog, roles, model) {
        var self = this;
        self.model = model || {
            role: null,
            selectedOrganizations: [],
            selectedContacts: []
        };
        //roles
        self.roles = roles;
        self.loadRoles = loadRoles;
        //organizations
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = organizationQuerySearch;
        //persons
        self.selectedItemP = null;
        self.searchTextP = null;
        self.querySearchP = personsQuerySearch;
        self.newContact = newContact;
        self.newContactOrg = newContactOrg;
        //actions
        self.save = save;
        self.cancel = cancel;

        function organizationQuerySearch(query) {
            return contactsQuerySearch(contactsService.getOrganizations, self.model.selectedOrganizations, query);
        }

        function personsQuerySearch(query) {
            return contactsQuerySearch(contactsService.getPersons, self.model.selectedContacts, query);
        }

        function contactsQuerySearch(contactsGetFunction, selected, query) {
            if (!query) {
                return [];
            }
            var pagingParams = {
                pageSize: 15,
                page: 1,
                sortAscending: true
            };
            return contactsGetFunction(query, pagingParams).then(function(response) {
                var contacts = response.items;
                //filter selected and saved values
                var usedIds = [];
                for (var i = 0; i < vm.parties.length; i++) {
                    usedIds.push(vm.parties[i].nodeRef);
                }
                for (var i = 0; i < selected.length; i++) {
                    usedIds.push(selected[i].nodeRefId);
                }
                return $filter('filter')(contacts, function(value, index, array) {
                    return usedIds.indexOf(value.nodeRefId) === -1;
                });
            });
        }

        function loadRoles() {
            return partyPermittedRolesService.getRoles().then(function(response) {
                self.roles = response;
            });
        }

        function save() {
            var contacts = self.model.selectedOrganizations.concat(self.model.selectedContacts).map(function(contact) {
                return contact.email;
            });
            casePartiesService.createCaseParty($stateParams.caseId, self.model.role, contacts).then(function(response) {
                $mdDialog.hide();
                fillList();
                if (contacts.length > 1) {
                    notificationUtilsService.notify($translate.instant("PARTY.PARTIES_ADDED_SUCCESSFULLY", {
                        count: contacts.length
                    }));
                } else {
                    notificationUtilsService.notify($translate.instant("PARTY.PARTY_ADDED_SUCCESSFULLY"));
                }
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function newContact(ev) {
            personDialogService
                    .showPersonEdit(ev, null, null, false)
                    .then(function(response) {
                        self.model.selectedContacts.push(response);
                        showAddPartiesDialog(ev, self.model);
                    }, function() {
                        showAddPartiesDialog(ev, self.model);
                    });
        }

        function newContactOrg(ev) {
            organizationDialogService
                    .showOrganizationEdit(ev, null, false)
                    .then(function(response) {
                        self.model.selectedOrganizations.push(response);
                        showAddPartiesDialog(ev, self.model);
                    }, function() {
                        showAddPartiesDialog(ev, self.model);
                    });
        }
    }

    function ChangePartyDialogController($mdDialog, party, roles) {
        var self = this;
        self.party = party;
        self.roles = roles;
        //actions
        self.save = save;
        self.cancel = cancel;

        function save() {
            casePartiesService.changeCaseParty($stateParams.caseId, self.party.nodeRef, self.party.roleRef).then(function(response) {
                $mdDialog.hide();
                notificationUtilsService.notify($translate.instant("PARTY.PARTY_CHANGED_SUCCESSFULLY"));
                fillList();
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }
}
