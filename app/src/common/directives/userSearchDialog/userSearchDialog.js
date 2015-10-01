(function () {
    'use strict';

    angular.module('openeApp.common.directives.filter')
        .directive('openeUserSearchDialog', openeUserSearchDialog);

    openeUserSearchDialog.$inject = ['$mdDialog', 'userService']

    function openeUserSearchDialog($mdDialog, userService) {

        function postlink(scope, elem, attrs) {


            scope.executeCallBack = function () {
                console.log("The list of selected users (userNames): " + scope.selectedUsers);
                //check that the array is not empty
                scope.submitCallBack(query);
            };//Execute the callback method passing in the array of selected users.
            scope.userSearchQuery = function () {
                var term = (scope.searchTerm == "" || scope.searchTerm == undefined) ? scope.searchTerm = "*" : scope.searchTerm;
                var query = "sortBy=" + scope.sortBy;
                query += '&dir=' + scope.sortOrder + '&filter=' + encodeURIComponent(term) + '&maxResults=' + scope.maxResults;
                return query;
            };
            /**
             * Adds or removes a user from the selectedUsers array
             * @param user
             */
            scope.toggleSelectedUsers = function (user) {
                if (scope.selectedUsers.indexOf(user) > -1)
                    scope.selectedUsers.splice(scope.selectedUsers.indexOf(user), 1);
                else
                    scope.selectedUsers.push(user);
            };

            // Cancel form in dialog
            scope.cancel = function () {
                scope.toggleSelectedUsers = [];
                scope.submitCallBack = null;
                scope.searchTerm = "";
                scope.sortOrder = "asc"; //or desc
                scope.sortBy = "userName";
                scope.maxResults = "100";
                $mdDialog.cancel();
            };

            scope.selectedUsersIsEmpty= function(){
                return (scope.selectedUsers === undefined || scope.selectedUsers.length == 0);
            };

            function populateUsersList() {
                getAllSystemUsers();
            }

            function getAllSystemUsers(query) {
                return userService.getPeople(query).then(function (response) {
                    scope.allSystemUsers = response.people;
                    return response;
                });
            }

        }

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                selectedUsers: '=',
                submitCallBack: '=',
                searchTerm: '=',
                sortOrder: '=', //or desc
                sortBy: '=',
                maxResults: '='
            },
            templateUrl: '/app/src/common/directives/userSearchDialog/view/userSearchDialog.html'
        }
    }
})();