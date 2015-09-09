(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$mdDialog', 'userService'];

    /**
     * Main Controller for the Admin module
     * @param $scope
     * @constructor
     */
    function AdminController($scope, $mdDialog, userService) {

        var vm = this;
        vm.createUser = createUser;
        vm.editUser = editUser;
        vm.userDialogMode = "Create";

        populateUsersList();
        function populateUsersList(){
            getAllSystemUsers();
        }

        function createUser(ev) {
            console.log('Creating a new user');

            vm.userDialogMode = "Create";
            $mdDialog.show({
                controller: UserDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/admin/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function editUser(ev, user) {
            console.log('Editing user');
            vm.userDialogMode = "Update";
            vm.user = user;

            $mdDialog.show({
                controller: UserDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/admin/view/userCrudDialog.html',
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
            ucd.dialogMode = vm.userDialogMode;
            ucd.cancel = cancel;
            ucd.update = update;
            ucd.getToastPosition = getToastPosition;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            }

            function update(u) {
                ucd.userData = angular.copy(u);
                var createSuccess = (ucd.dialogMode == "Create") ? userService.createUser(ucd.userData) : userService.updateUser(ucd.userData);
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
