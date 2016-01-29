angular
    .module('openeApp.cases.parties')
    .controller('CasePartiesController', CasePartiesController);

function CasePartiesController($scope, $stateParams, $mdDialog, $filter, $translate, personDialogService,
    casePartiesService, partyPermittedRolesService, contactsService, notificationUtilsService, alfrescoNodeUtils) {
    var vm = this;
    vm.parties = [];
    vm.removeParty = removeParty;
    vm.createCaseParty = createCaseParty;
    vm.changeCaseParty = changeCaseParty;
    vm.showAddPartiesDialog = showAddPartiesDialog;
    vm.showChangePartyDialog = showChangePartyDialog;
    vm.showPersonReadOnly = showPersonReadOnly;
    vm.layout = 'list';

    fillList();

    function fillList() {
        vm.parties.length = 0;
        casePartiesService.getCaseParties($stateParams.caseId).then(function(parties) {
            vm.parties = parties;
        });
    }

    function createCaseParty(role, nodeRefIds) {
        return casePartiesService.createCaseParty($stateParams.caseId, role, nodeRefIds).then(function(response) {
            fillList();
        });
    }

    function changeCaseParty(contactNodeRefId, oldRole, newRole) {
        return casePartiesService.changeCaseParty($stateParams.caseId, contactNodeRefId, oldRole, newRole).then(function(response) {
            fillList();
        });
    }

    function removeParty(ev, party) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('COMMON.CONFIRM'))
            .textContent($translate.instant('PARTY.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_PARTY', party))
            .ariaLabel('delete confirmation')
            .targetEvent(ev)
            .ok($translate.instant('COMMON.YES'))
            .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            casePartiesService.deleteCaseParty($stateParams.caseId, party).then(function(response) {
                //remove from list
                var index = vm.parties.indexOf(party);
                vm.parties.splice(index, 1);
                //notify
                notificationUtilsService.notify($translate.instant("PARTY.PARTY_REMOVED_SUCCESSFULLY"));
            }, error);
        });
    }

    function error(response) {
        notificationUtilsService.alert(response.data.message);
    }

    function showAddPartiesDialog(ev, model) {
        partyPermittedRolesService.getRoles().then(function(roles) {
            $mdDialog.show({
                controller: AddPartyDialogController,
                controllerAs: "ctrl",
                templateUrl: 'app/src/parties/view/casePartiesAddDialog.html',
                parent: angular.element(document.body),
                focusOnOpen: false,
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    roles: roles,
                    model: model
                }
            }).then(function(response) {
                //
            });
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
                party: angular.copy(party)
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
            vm.createCaseParty(self.model.role, contacts).then(function() {
                $mdDialog.hide();
                if (contacts.length > 1) {
                    notificationUtilsService.notify($translate.instant("PARTY.PARTIES_ADDED_SUCCESSFULLY", {
                        count: contacts.length
                    }));
                } else {
                    notificationUtilsService.notify($translate.instant("PARTY.PARTY_ADDED_SUCCESSFULLY"));
                }
            }, error);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function newContact(ev) {
            personDialogService
                .showPersonEdit(ev)
                .then(function(response) {
                    self.model.selectedContacts.push(response);
                    showAddPartiesDialog(ev, self.model);
                }, function() {
                    showAddPartiesDialog(ev, self.model);
                });
        }
    }

    function ChangePartyDialogController($mdDialog, party) {
        var self = this;
        self.party = party;
        self.newRole = null;
        self.roles = null;
        self.loadRoles = loadRoles;
        //actions
        self.save = save;
        self.cancel = cancel;

        function loadRoles() {
            return partyPermittedRolesService.getRoles().then(function(response) {
                var currentRole = response.indexOf(self.party.role);
                response.splice(currentRole, 1);
                self.roles = response;
            });
        }

        function save() {
            vm.changeCaseParty(self.party.nodeRef, self.party.role, self.newRole).then(function() {
                $mdDialog.hide();
                notificationUtilsService.notify($translate.instant("PARTY.PARTY_CHANGED_SUCCESSFULLY"));
            }, error);
        }

        function cancel() {
            $mdDialog.cancel();
        }

    }
}
