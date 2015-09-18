(function () {
    'use strict';

    angular
        .module('openeApp.groups')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$scope', '$mdDialog', 'groupService'];

    /**
     * Main Controller for the Groups module
     * @param $scope
     * @constructor
     */
    function GroupController($scope, $mdDialog, groupService) {
        var vm = this;
        vm.group = {};
        vm.groups = [];

        initList();

        function initList() {
            vm.groups.length = [];
            groupService.listAllSystemGroups().then(function (response) {
                vm.groups = response;
            }, function (error) {
                console.log(error);
            });
        }

        // Return an array of group objects
        function listGroups() {
            groupService.listAllSystemGroups().then(function (response) {
                vm.groups = response;
            }, function (error) {
                console.log(error);
            });
        }

        // !! Probably something that must be done with routes. !!
        // Display the group view and load it with one group object
        function showGroup(group_shortName) {
            groupService.getGroup(group_shortName).then(
                function (response) {
                    vm.group = response;
                },
                function (error) {
                    console.log(error)
                });
        }

        // Return an array of user and group objects belonging to this group
        function listMembers(group_shortName) {
            showGroup(group_shortName).then( function(){
                groupService.getGroupMembers(group_shortName).then(function(response){
                    vm.group.members = response;
                });
            });
        }

        // Add a user or subgroup to group
        function addMember(group_shortName) {
            groupService.addUserToGroup(shortName, userName).then(function (response) {
                if (isEmpty(response))
                //TODO Output notice here and/or go to view???
                    alert(userName + " was successfully added to group (" + shortName + ").");
            });
        }

        // Remove member from group
        function removeUserFromGroup(group_shortName, userName) {
            groupService.removeUserFromGroup(group_shortName, userName).then(function(response){
                if (isEmpty(response))
                //TODO Output notice here and/or go to view???
                    alert(userName + " was successfully removed from group (" + group_shortName + ").");
            });
        }

        function createGroup(shortName, displayName) {
            groupService.createGroup(shortName, displayName).then(function (response) {
                vm.group = response;
                //TODO goto view
            });
        }


        function deleteGroup(shortName) {
            groupService.deleteGroup(shortName).then(function (response) {
                vm.group = response;
                //TODO goto view
            });
        }

        /**
         * Test if an object is empty ECMAScript 5+ compliant
         * @param obj
         * @returns {boolean}
         */
        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

    };

})();
