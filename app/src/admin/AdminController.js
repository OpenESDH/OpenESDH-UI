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
  function AdminController($scope) {
        initTab();

        function initTab() {
            $scope.$on('$stateChangeSuccess', function(event, toState) {
                $scope.currentTab = toState.data.selectedTab;
                $scope.searchContext = toState.data.searchContext;
            });
        }
    }

})();
