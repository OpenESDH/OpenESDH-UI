(function(){
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
        initTab();
        var vm = this;
        vm.createUser = createUser;
        vm.editUser = editUser;
        vm.userExists = false;

        populateUsersList();
        function populateUsersList(){
            getAllSystemUsers();
        }


        function initTab() {
            $scope.$on('$stateChangeSuccess', function(event, toState) {
                $scope.currentTab = toState.data.selectedTab;
                $scope.searchContext = toState.data.searchContext;
            });
        }
      
        function createUser(ev) {
            console.log('Creating a new user');
            vm.userExists = false;
            vm.user = {};

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
            vm.userExists = true;
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
