(function () {
    'use strict';

    angular
        .module('openeApp.users')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$scope', '$mdDialog', 'userService'];

    /**
     * Main Controller for the system users module
     * @param $scope
     * @constructor
     */
    function UsersController($scope, $mdDialog, userService) {
        var vm = this;

        vm.createUser = createUser;
        vm.editUser = editUser;
        vm.userExists = false;

        //For the search control filter
        vm.userSearchFilters = [
            {optionLabel:"First name", optionValue:"firstName"},
            {optionLabel:"Last name", optionValue:"lastName"},
            {optionLabel:"User name", optionValue:"userName"}
        ];
        vm.optionLabel = "optionLabel";
        vm.optionValue = "optionValue";
        vm.selectOptions = vm.userSearchFilters;
        vm.searchFilterCallback = "findPersons";

        populateUsersList();
        function populateUsersList() {
            getAllSystemUsers();
        }

        function createUser(ev) {
            console.log('Creating a new user');
            vm.userExists = false;
            vm.user = {};

            $mdDialog.show({
                controller: UserDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/users/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function editUser(ev, user) {
            console.log('Editing user');
            vm.userExists = true;
            vm.user = user;

            $mdDialog.show({
                controller: UserDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/users/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function UserDialogController($scope, $mdDialog, $mdToast, $animate, userService) {
            var ucd = this;

            // Data from the user creation form
            $scope.user = vm.user;
            ucd.userData = {};
            ucd.userExists = vm.userExists;
            ucd.cancel = cancel;
            ucd.update = update;
            ucd.getToastPosition = getToastPosition;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            }

            function update(u) {
                ucd.userData = angular.copy(u);
                ucd.userData.disableAccount = u.enabled;
                var createSuccess = (ucd.userExists) ? userService.updateUser(ucd.userData) : userService.createUser(ucd.userData);
                console.log(ucd.userData);
                $mdDialog.cancel();
                notifyUserSaved(createSuccess);
            }

            // When the form is submitted, show a notification:
            ucd.toastPosition = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };

            function getToastPosition() {
                return Object.keys(ucd.toastPosition)
                    .filter(function (pos) {
                        return ucd.toastPosition[pos];
                    })
                    .join(' ');
            }

            function notifyUserSaved(cuSuccess) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(cuSuccess.message)
                        .position(ucd.getToastPosition())
                        .hideDelay(3000)
                );
                getAllSystemUsers();
            }
        }

        function getAllSystemUsers() {
            return userService.getPeople("*").then(function (response) {
                vm.allSystemUsers = response.people;
                return response;
            });
        }
    }

})();
