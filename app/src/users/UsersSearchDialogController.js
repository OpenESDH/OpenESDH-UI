(function () {
    'use strict';

    angular
        .module('openeApp.users')
        .controller('UsersSearchDialogController', UsersSearchDialogController);

    UsersSearchDialogController.$inject = ['$scope', '$mdDialog', 'userService'];

    /**
     * Controller for the users search dialog module
     * @param $scope
     * @constructor
     * @return {boolean}
     */
    function UsersSearchDialogController($scope, $mdDialog, userService) {
        var vm = this;

        vm.selectedUsers = []; //The current list of selected users
        vm.submitCallBack = null;
        vm.searchTerm = "";
        vm.sortOrder = "asc"; //or desc
        vm.sortBy = "userName";
        vm.maxResults = "100";

        populateUsersList();

        vm.executeCallBack = function () {
            console.log("The list of selected users (userNames): " + vm.selectedUsers);
            //check that the array is not empty
            vm.submitCallBack(query);
        };//Execute the callback method passing in the array of selected users.
        vm.userSearchQuery = function () {
            var term = (vm.searchTerm == "" || vm.searchTerm == undefined) ? vm.searchTerm = "*" : vm.searchTerm;
            var query = "sortBy=" + vm.sortBy;
            query += '&dir=' + vm.sortOrder + '&filter=' + encodeURIComponent(term) + '&maxResults=' + vm.maxResults;
            return query;
        };
        /**
         * Adds or removes a user from the selectedUsers array
         * @param user
         */
        vm.toggleSelectedUsers = function (user) {
            if (vm.selectedUsers.indexOf(user) > -1)
                vm.selectedUsers.splice(vm.selectedUsers.indexOf(user), 1);
            else
                vm.selectedUsers.push(user);
        };

        // Cancel form in dialog
        vm.cancel = function () {
            vm.toggleSelectedUsers = [];
            vm.submitCallBack = null;
            vm.searchTerm = "";
            vm.sortOrder = "asc"; //or desc
            vm.sortBy = "userName";
            vm.maxResults = "100";
            $mdDialog.cancel();
        };

        vm.selectedUsersIsEmpty= function(){
            return (vm.selectedUsers === undefined || vm.selectedUsers.length == 0);
        };

        function populateUsersList() {
            getAllSystemUsers();
        }

        function getAllSystemUsers(query) {
            return userService.getPeople(query).then(function (response) {
                vm.allSystemUsers = response.people;
                return response;
            });
        }


    }

})();
