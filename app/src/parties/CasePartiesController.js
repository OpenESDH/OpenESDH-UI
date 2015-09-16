(function() {

    angular
            .module('openeApp.cases.parties')
            .controller('CasePartiesController', CasePartiesController);

    CasePartiesController.$inject = ['$scope', '$stateParams', '$mdDialog', '$filter',
        'casePartiesService', 'partyPermittedRolesService', 'contactsService'];

    function CasePartiesController($scope, $stateParams, $mdDialog, $filter,
            casePartiesService, partyPermittedRolesService, contactsService) {
        var vm = this;
        vm.parties = [];
        vm.removeParty = removeParty;
        vm.createCaseParty = createCaseParty;
        vm.changeCaseParty = changeCaseParty;
        vm.showAddPartiesDialog = showAddPartiesDialog;
        vm.showChangePartyDialog = showChangePartyDialog;

        //lets init only when tab is selected
        $scope.$on('tabSelectEvent', function(event, args) {
            if (args.tab === 'parties') {
                fillList();
            }
        });

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

        function removeParty(party) {
            casePartiesService.deleteCaseParty($stateParams.caseId, party).then(function(response) {
                //remove from list
                var index = vm.parties.indexOf(party);
                vm.parties.splice(index, 1);
            });
        }

        function showAddPartiesDialog(ev) {
            $mdDialog.show({
                controller: AddPartyDialogController,
                controllerAs: "ctrl",
                templateUrl: 'app/src/parties/view/casePartiesAddDialog.html',
                parent: angular.element(document.body),
                focusOnOpen: false,
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function(response) {
                //
            }, function() {
                //on cancel dialog
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
            }, function() {
                //on cancel dialog
            });
        }

        function AddPartyDialogController($scope, $mdDialog) {
            var self = this;
            //roles
            self.roles = null;
            self.loadRoles = loadRoles;
            //organizations
            self.selectedItem = null;
            self.searchText = null;
            self.querySearch = organizationQuerySearch;
            self.selectedOrganizations = [];
            //persons
            self.selectedItemP = null;
            self.searchTextP = null;
            self.querySearchP = personsQuerySearch;
            self.selectedContacts = [];

            //actions
            self.save = save;
            self.cancel = cancel;

            function organizationQuerySearch(query) {
                return contactsQuerySearch(contactsService.getOrganizations, self.selectedOrganizations, query);
            }

            function personsQuerySearch(query) {
                return contactsQuerySearch(contactsService.getPersons, self.selectedContacts, query);
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

            function save(role, organizations, persons) {
                var contacts = organizations.concat(persons).map(function(contact) {
                    return contact.email;
                });
                vm.createCaseParty(role, contacts).then(function() {
                    $mdDialog.hide();
                });
            }
            function cancel() {
                $mdDialog.cancel();
            }

        }
        function ChangePartyDialogController($scope, $mdDialog, party) {
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
                });
            }

            function cancel() {
                $mdDialog.cancel();
            }

        }
    }
})();
