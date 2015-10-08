
    angular
        .module('openeApp.cases.members')
        .controller('CaseMembersController', CaseMembersController);

    function CaseMembersController($scope, $stateParams, $translate, caseMembersService,
            $mdDialog, userService, caseRoleService, notificationUtilsService) {
        var vm = this;
        vm.members = [];

        vm.showNewDialog = showNewDialog;
        vm.showChangeDialog = showChangeDialog;

        vm.createMember = createMember;
        vm.changeMember = changeMember;
        vm.removeMember = removeMember;

        //lets init only when tab is selected
        $scope.$on('tabSelectEvent', function(event, args) {
            if (args.tab === 'members') {
                fillList();
            }
        });

        function fillList() {
            vm.members.length = 0;
            caseMembersService.getCaseMembers($stateParams.caseId).then(function(members) {
                vm.members = members;
            });
        }

        function removeMember(ev, member) {
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .content($translate.instant('MEMBER.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_MEMBER', member))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                caseMembersService.deleteCaseMember($stateParams.caseId, member.authority, member.role).then(successRemove, error);
            });
        }

        function createMember(role, authorities) {
            return caseMembersService
                    .createCaseMembers($stateParams.caseId, role, authorities)
                    .then(function() {
                        if (authorities.length > 1) {
                            success($translate.instant("MEMBER.MEMBERS_ADDED_SUCCESSFULLY", {count: authorities.length}));
                        } else {
                            success($translate.instant("MEMBER.MEMBER_ADDED_SUCCESSFULLY"));
                        }
                    }, error);
        }

        function changeMember(authority, role, newRole) {
            return caseMembersService
                    .changeCaseMember($stateParams.caseId, authority, role, newRole)
                    .then(successChange, error);
        }

        function successChange() {
            success($translate.instant("MEMBER.MEMBER_CHANGED_SUCCESSFULLY"));
        }

        function successRemove() {
            success($translate.instant("MEMBER.MEMBER_REMOVED_SUCCESSFULLY"));
        }

        function success(msg) {
            fillList();
            notificationUtilsService.notify(msg);
        }

        function error(response) {
            notificationUtilsService.alert(response.data.message);
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
                    self.authorities = response.map(function(authority) {
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