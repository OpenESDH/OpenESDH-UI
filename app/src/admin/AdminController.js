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

        function initTab() {
            $scope.$on('$stateChangeSuccess', function(event, toState) {
                $scope.currentTab = toState.data.selectedTab;
            });
        }
      
        function createUser(ev) {
            
            console.log('Creating a new user');

            $mdDialog.show({
                controller: UserCreateDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/admin/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
        };
        
        function UserCreateDialogController($scope, $mdDialog, $mdToast, $animate) {
            var vm = this;
          
            // Data from the user creation form
            vm.userData = {};
            vm.cancel = cancel;
            vm.update = update;
            vm.getToastPosition = getToastPosition;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            };
            function update(u) {
                vm.userData = angular.copy(u);
                console.log(vm.userData);
                $mdDialog.cancel();
                notifyUserSaved();

                // When submitting, do something with the case data
                
            };
          
          
            // When the form is submitted, show a notification:
          
            vm.toastPosition = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            function getToastPosition() {
                return Object.keys(vm.toastPosition)
                  .filter(function(pos) { return vm.toastPosition[pos]; })
                  .join(' ');
            };

            function notifyUserSaved() {
                $mdToast.show(
                    $mdToast.simple()
                        .content('User created')
                        .position(vm.getToastPosition())
                        .hideDelay(3000)
                );
            };
          
        };  
      
  };
  
})();
