
    angular.module('openeApp.common.directives')
        .directive('openeGroupUserDialog', openeGroupUserDialog);

    function openeGroupUserDialog($mdDialog, userService, groupService) {

        function postlink(scope, elem, attrs) {

            scope.selectedItems = [];
            scope.sortOrder = "asc"; //or desc
            scope.sortBy = "userName";
            scope.maxResults = "100";

            scope.openDialog = function (event) {
                $mdDialog.show({
                    scope: scope,
                    preserveScope: true,
                    templateUrl: '/app/src/common/directives/groupUserDialog/view/groupUserDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                });
            };

            // Cancel form in dialog
            scope.cancel = function () {
                scope.selectedItems = [];
                scope.searchTerm = "";
                scope.sortOrder = "asc"; //or desc
                scope.sortBy = "userName";
                scope.maxResults = "100";
                $mdDialog.cancel();
            };

            // Returns the selected items to the directive callback function
            scope.executeCallback = function () {
                if(!scope.selectedItems.length) return;
                scope.getSelectedItems( scope.selectedItems
                );
                scope.cancel();
            };

            // Function executed when typing in searchfield
            scope.searchItemsByQuery = function(queryterm) {
                if(scope.searchType === 'users') return searchUsers(queryterm);
                if(scope.searchType === 'groups') return searchGroups(queryterm);
            };

            /**
             * User search
             */
            function searchUsers(queryterm) {
                var query = createUserSearchQuery(queryterm);
                return userService.getPeople(query).then(function (response) {
                    return response.people.map(function (contact, index) {
                        return {
                            name: contact.firstName + ' ' + contact.lastName,
                            email: contact.email,
                            type: "user",
                            userName: contact.userName
                        }
                    });
                });
            };

            function createUserSearchQuery(queryterm) {
                var query = encodeURIComponent(queryterm);
                query += "&sortBy=" + scope.sortBy + '&dir=' + scope.sortOrder + '&maxResults=' + scope.maxResults;
                return query;
            }

            /**
             * Group search
             */
            function searchGroups(queryterm) {
                return groupService.findGroup(queryterm).then(function (response) {
                    return response.data.map(function (group, index) {
                        return {
                            name: group.displayName,
                            type: "group",
                            shortName: group.shortName
                        }
                    });
                });
            };

        };

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                getSelectedItems: '=',
                searchType: '@'
            },
            template: '<md-button aria-label="{{ (searchType == \'users\' ? \'GROUP.ADD_USERS\' : \'GROUP.ADD_GROUPS\') | translate }}" class="md-primary" ng-click="openDialog($event)">' +
                        '<i class="material-icons">person_add</i> {{ (searchType == \'users\' ? \'GROUP.ADD_USERS\' : \'GROUP.ADD_GROUPS\') | translate }}' +
                      '</md-button>'
        }
    }