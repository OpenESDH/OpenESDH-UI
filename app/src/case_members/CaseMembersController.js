(function() {

    angular
            .module('openeApp.cases.members')
            .controller('CaseMembersController', CaseMembersController);

    CaseMembersController.$inject = ['$scope', '$stateParams', 'caseMembersService',
        '$mdDialog', 'userService', 'caseRoleService'];

    function CaseMembersController($scope, $stateParams, caseMembersService,
            $mdDialog, userService, caseRoleService) {
        var vm = this;
        vm.status = null;
        vm.members = [];

        vm.showNewDialog = showNewDialog;
        vm.showChangeDialog = showChangeDialog;

        vm.createMember = createMember;
        vm.changeMember = changeMember;
        vm.removeMember = removeMember;

        //lets init only when tab is selected
        $scope.$on('tabSelectEvent', function(event, args) {
            if (args.tab === 'members') {
                vm.status = null;
                fillList();
            }
        });

        function fillList() {
            vm.members.length = 0;
            caseMembersService.getCaseMembers($stateParams.caseId).then(function(members) {
                vm.members = members;
            });
        }

        function removeMember(member) {
            vm.status = null;
            return caseMembersService.deleteCaseMember($stateParams.caseId, member.authority, member.role).then(success, error);
        }

        function createMember(role, authorities) {
            vm.status = null;
            return caseMembersService
                    .createCaseMembers($stateParams.caseId, role, authorities)
                    .then(success, error);
        }

        function changeMember(authority, role, newRole) {
            vm.status = null;
            return caseMembersService
                    .changeCaseMember($stateParams.caseId, authority, role, newRole)
                    .then(success, error);
        }

        function success() {
            vm.status = 'Success';
            fillList();
        }

        function error(response) {
            vm.status = 'Error: ' + response;
        }

        function showNewDialog(event) {
            $mdDialog.show({
                controller: AddMemberDialogController,
                controllerAs: "cmcAdd",
                templateUrl: 'app/src/case_members/view/caseMembersAddDialog.html',
                parent: angular.element(document.body),
                focusOnOpen: false,
                targetEvent: event,
                clickOutsideToClose: true
            });
        }

        function showChangeDialog(event, member) {
            $mdDialog.show({
                controller: ChangeMemberDialogController,
                controllerAs: "cmcChange",
                templateUrl: 'app/src/case_members/view/caseMembersChangeDialog.html',
                parent: angular.element(document.body),
                focusOnOpen: false,
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    member: angular.copy(member)
                }
            });
        }


        function AddMemberDialogController($scope, $mdDialog) {
            var self = this;
            //roles
            self.role = null;
            self.roles = null;
            self.loadRoles = loadRoles;
            //authorities
            self.selectedItem = null;
            self.searchText = null;
            self.querySearch = authoritiesQuerySearch;
            loadAuthorities();
            self.selectedAuthorities = [];

            //actions
            self.save = save;
            self.cancel = cancel;

            function authoritiesQuerySearch(query) {
                var results = query ? self.authorities.filter(createFilterFor(query)) : [];
                return results;
            }

            /*
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(authority) {
                    return (authority._lowername.indexOf(lowercaseQuery) === 0);
                };
            }

            function loadAuthorities() {
                return userService.getAuthorities().then(function(response) {
                    self.authorities =  response.map(function(authority) {
                        authority._lowername = angular.lowercase(authority.name);
                        return authority;
                    });
                    return self.authorities;
                });
            }

            function loadRoles() {
                return caseRoleService.getCaseRoles($stateParams.caseId).then(function(response) {
                    self.roles = response;
                    return response;
                });
            }

            function save() {
                var authorities = self.selectedAuthorities.map(function(authority) {
                    return authority.nodeRef;
                });
                vm.createMember(self.role, authorities).then(function() {
                    $mdDialog.hide();
                });
            }
            function cancel() {
                $mdDialog.cancel();
            }

        }

        function ChangeMemberDialogController($scope, $mdDialog, member) {
            var self = this;
            self.member = member;
            self.newRole = null;
            self.roles = null;
            self.loadRoles = loadRoles;
            //actions
            self.save = save;
            self.cancel = cancel;

            function loadRoles() {
                return caseRoleService.getCaseRoles($stateParams.caseId).then(function(response) {
                    var currentRole = response.indexOf(self.member.role);
                    response.splice(currentRole, 1);
                    self.roles = response;
                });
            }

            function save() {
                vm.changeMember(self.member.authority, self.member.role, self.newRole).then(function() {
                    $mdDialog.hide();
                });
            }

            function cancel() {
                $mdDialog.cancel();
            }
        }
    }
})();
