(function() {
    'use strict';

    angular.module('openeApp.common.directives')
        .directive('openeUserSearchDialog', openeUserSearchDialog);

    openeUserSearchDialog.$inject = ['$mdDialog', 'userService']

    function openeUserSearchDialog($mdDialog, userService) {

        function postlink(scope, elem, attrs) {

            scope.selectedUsers = [];
            scope.sortOrder = "asc"; //or desc
            scope.sortBy = "userName";
            scope.maxResults = "100";

            scope.openDialog = function (event) {
                $mdDialog.show({
                    scope: scope,
                    preserveScope: true,
                    templateUrl: '/app/src/common/directives/userSearchDialog/view/userSearchDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                });
            }

            // Cancel form in dialog
            scope.cancel = function () {
                scope.selectedUsers = [];
                scope.searchTerm = "";
                scope.sortOrder = "asc"; //or desc
                scope.sortBy = "userName";
                scope.maxResults = "100";
                $mdDialog.cancel();
            };

            // Returns the selected users to the directive callback function
            scope.executeCallback = function () {
                if(!scope.selectedUsers.length) return;
                
                console.log("The list of selected users (userNames): ", scope.selectedUsers);
                
                return scope.getSelectedUsers(scope.selectedUsers);
            };

            scope.getAllSystemUsers = function(queryterm) {
                var query = createQuery(queryterm);
                return userService.getPeople(query).then(parseResult);
            };

            function parseResult (response) {
                return response.people.map(function (contact, index) {
                    return {
                        name: contact.firstName + ' ' + contact.lastName,
                        email: contact.email,
                        username: contact.userName
                    }
                });
            }

            function createQuery(queryterm) {
                var query = "sortBy=" + scope.sortBy;
                query += '&dir=' + scope.sortOrder + '&filter=' + encodeURIComponent(queryterm) + '&maxResults=' + scope.maxResults;
                return query;
            };

        };

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                getSelectedUsers: '='
            },
            template: '<md-button aria-label="{{ \'GROUP.ADD_USERS\' | translate }}" class="md-primary" ng-click="openDialog($event)">' +
                        '<i class="material-icons">person_add</i> {{ \'GROUP.ADD_USERS\' | translate }}' +
                      '</md-button>'
        }
    }
})();