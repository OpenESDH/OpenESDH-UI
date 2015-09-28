(function () {
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope', '$mdDialog', 'userService'];

    /**
     * Main Controller for the User module
     * @param $scope
     * @constructor
     */
    function UserController($rootScope, $scope, $mdDialog, userService) {
        initTab();
        var vm = this;
        vm.changeUserPassword = changePassword;

        function changePassword(ev) {
            console.log('Changing user password');

            $mdDialog.show({
                controller: UserPasswordDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/admin/view/userCrudDialog.html', //TODO change to template and remove this TODO
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Handles the change user password dialog
         * @param $mdDialog
         * @param $mdToast
         * @param $animate
         * @param userService
         * @constructor
         */
        function UserPasswordDialogController($mdDialog, $mdToast, $animate, userService) {
            var ucd = this;
            ucd.cancel = cancel;
            ucd.update = updateUserPassword;
            ucd.getToastPosition = getToastPosition;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            }

            function updateUserPassword(u) {
                //add the userName to the received object
                ucd.userData = angular.copy(u);
                /**
                 * although we could probably pull this from the $rootScope object in userService#updateUserPassword
                 * method since this method should/will only be called by the currently logged in user.
                 */
                ucd.userData.userName = $rootScope.user.userName;

                var passwordChangeSuccess = userService.updateUserPassword();
                console.log(ucd.userData);
                $mdDialog.cancel();
                notifyUserPasswordSaved(passwordChangeSuccess);
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

            function notifyUserPasswordSaved(passwordChangeSuccess) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(passwordChangeSuccess.message)
                        .position(ucd.getToastPosition())
                        .hideDelay(3000)
                );
            }
        }

    }

})();
