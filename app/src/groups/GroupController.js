
angular
        .module('openeApp.groups')
        .controller('GroupController', GroupController);

/*
 * Main Controller for the Groups module
 * @param $scope
 * @constructor
 */
function GroupController($scope, $mdDialog, groupService, $stateParams, $translate, sessionService) {
    var vm = this;
    vm.group = {};
    vm.groups = [];
    vm.loadList = loadList;
    vm.createGroup = createGroup;
    vm.deleteGroup = deleteGroup;
    vm.addMembersToGroup = addMembersToGroup;
    vm.removeMemberFromGroup = removeMemberFromGroup;
    vm.showCSVUploadDialog = showCSVUploadDialog;
    vm.sessionTicket = sessionService.getUserInfo().ticket;

    if ($stateParams && $stateParams.shortName && $stateParams.shortName !== 'ALL') {
        showGroup($stateParams.shortName);
        listMembers($stateParams.shortName);
        console.log("re-listing groups");
    } else {
        vm.groupTypeFilter = initGroupTypeFilter();
        vm.groupType = vm.groupTypeFilter[2];
        loadList();
    }
    
    function loadList() {
        vm.groups.length = [];
        groupService.listGroupsByType(vm.groupType.value).then(function(response) {
            vm.groups = response.data;
        }, function(error) {
            console.log(error);
        });
    }
    
    function initGroupTypeFilter () {
        return [{
            name: $translate.instant('GROUP.FLT_ALL'),
            value: 'ALL'
        },{
            name: $translate.instant('GROUP.FLT_SYS'),
            value: 'SYS'
        }, {
            name: $translate.instant('GROUP.FLT_OPENE'),
            value: 'OE'
        }, {
            name: $translate.instant('GROUP.FLT_SIMPLE'),
            value: 'SIMPLE'
        }, {
            name: $translate.instant('GROUP.FLT_STAFF'),
            value: 'STAFF'
        }];
    }

    // !! Probably something that must be done with routes. !!
    // Display the group view and load it with one group object
    function showGroup(group_shortName) {
        groupService.getGroup(group_shortName).then(
                function(response) {
                    vm.group = response.data;
                },
                function(error) {
                    console.log(error);
                });
    }
    
    // Return an array of user and group objects belonging to this group
    function listMembers(group_shortName) {
        groupService.getGroupMembers(group_shortName).then(function(response) {
            vm.groups = response.data;
        });
    }

    // Add a user or subgroup to group
    function addMembersToGroup(candidates) {
        var group_shortName = $stateParams.shortName;
        console.log("Adding following users to the group: ", group_shortName, candidates);
        var groups = [], users = [];
        candidates.forEach(function(member) {
            if (member.type === "user")
                users.push(member.userName);
            if (member.type === "group")
                groups.push(member.shortName);
        });
        var members = {groups: groups, users: users};
        groupService.addGroupMembers(group_shortName, members).then(function(response) {
            console.log('Adding users to group');
            if (isEmpty(response))
                //TODO Output notice here and/or go to view???
                console.log("Member(s) were successfully added to group (" + group_shortName + ").");
            else
                vm.groups = response.data;
        });
    }

    // Remove member from group
    function removeMemberFromGroup(group_shortName, authType, memberName, ev) {
        var confirmDel = $mdDialog.confirm()
                .title('Remove member')
                .textContent('Remove ' + memberName + ' from ' + group_shortName + ' group?')
                .ariaLabel('Delete group')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
        $mdDialog.show(confirmDel).then(function() {
            if (authType === "GROUP")
                memberName = authType + "_" + memberName;
            groupService.removeMemberFromGroup(group_shortName, memberName).then(function(response) {
                if (isEmpty(response))
                    //TODO Output notice here and/or go to view???
                    console.log(memberName + " was successfully removed from group (" + group_shortName + ").");
                listMembers(group_shortName);
            });
        }, function() {
            console.log('Cancelled');
        });
    }

    function createGroup(ev) {
        console.log('Creating a new group');
        vm.groupExists = false;
        vm.group = {};

        $mdDialog.show({
            controller: GroupDialogController,
            controllerAs: 'vm',
            templateUrl: 'app/src/groups/view/groupCuDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }

    function deleteGroup(shortName, ev) {
        var confirmDel = $mdDialog.confirm()
                .title('Delete group')
                .textContent('Delete ' + shortName + '?')
                .ariaLabel('Delete group')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
        $mdDialog.show(confirmDel).then(function() {
            groupService.deleteGroup(shortName).then(function(response) {
                vm.group = response;
                //TODO goto view
            });
            console.log('Deleted');
        }, function() {
            console.log('Cancelled');
        });
    }
    
    function showCSVUploadDialog(){

        return $mdDialog.show({
            controller: groupsUploadCSVDialogController,
            templateUrl: 'app/src/groups/view/groupsUploadDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            focusOnOpen: false
        }).then(function(){
            loadList();
        });
    }
    
    function groupsUploadCSVDialogController($scope, $translate, $mdDialog) {

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.upload = function(ev){
            $mdDialog.hide();
            groupService.uploadGroupsCSVFile($scope.fileToUpload).then(function(response){
                var failedUsers=[], msg, dlgTitle;
                dlgTitle = $translate.instant('COMMON.SUCCESS');
                msg = $translate.instant('GROUP.UPLOAD_GROUPS_SUCCESS');
                if(response.STATUS == "FAILED"){
                    msg = response.message;
                    dlgTitle = $translate.instant('COMMON.ERROR');
                }
                
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('body')))
                        .clickOutsideToClose(true)
                        .title(dlgTitle)
                        .textContent(msg)
                        .ariaLabel('User upload csv response.')
                        .ok("OK")
                        .targetEvent(ev)
                );
            });
        };
    }
    

    /**
     * Test if an object is empty ECMAScript 5+ compliant
     * @param obj
     * @returns {boolean}
     */
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * THe controller for the cu (create/update) dialog(s)
     * @param $scope
     * @param $mdDialog
     * @param $mdToast
     * @param $animate
     * @param groupService
     * @constructor
     */
    function GroupDialogController($scope, $mdDialog, $mdToast, $animate, groupService) {
        var gdc = this;

        // Data from the user creation form
        $scope.group = vm.group;
        gdc.groupExists = vm.groupExists;
        gdc.cancel = cancel;
        gdc.update = update;
        gdc.getToastPosition = getToastPosition;

        // Cancel or submit form in dialog
        function cancel(form) {
            $mdDialog.cancel();
        }

        function update(u) {
            gdc.groupData = angular.copy(u);
            var createSuccess = (gdc.groupExists) ? groupService.updateGroup(gdc.groupData.shortName, gdc.groupData.displayName) : groupService.createGroup(gdc.groupData.shortName, gdc.groupData.displayName);
            console.log("Group created and returned:" + createSuccess);
            debugger;
            $mdDialog.cancel();
            notifyUserSaved(createSuccess);
            loadList();
        }

        // When the form is submitted, show a notification:
        gdc.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        function getToastPosition() {
            return Object.keys(gdc.toastPosition)
                    .filter(function(pos) {
                        return gdc.toastPosition[pos];
                    })
                    .join(' ');
        }

        function notifyUserSaved(cuSuccess) {
            $mdToast.show(
                    $mdToast.simple()
                    .content(cuSuccess.message)
                    .position(gdc.getToastPosition())
                    .hideDelay(3000)
                    );
            getAllSystemUsers();
        }
    }

}
