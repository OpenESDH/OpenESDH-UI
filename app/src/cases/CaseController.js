(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

    CaseController.$inject = ['$scope', '$mdDialog', 'caseService', 'userService'];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($scope, $mdDialog, caseService, userService) {
        var vm = this;
        vm.cases = [];

        vm.getCases = getCases;
        vm.createCase = createCase;

        activate();

        function activate() {
            getAuthorities();
            getCases();
        }

        function getCases() {
            return caseService.getCases('base:case').then(function(response) {
                vm.cases = response;
                return vm.cases;
            }, function(error) {
                console.log(error);
            });
        }
        
//        $scope.authorities = ['person one', 'person two', 'person three'];

        function createCase(ev, caseType) {
            // In the future, we'll need the ability to create other types of cases
            console.log('Creating a new case of type ' + caseType);

            $mdDialog.show({
                controller: CaseCreateDialogController,
                controllerAs: 'vm',
                templateUrl: 'app/src/cases/view/caseCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                focusOnOpen: false
            });
        };
        
        function CaseCreateDialogController($scope, $mdDialog, $mdToast, $animate) {
            var vm = this;
          
            // Data from the case creation form
            vm.caseData = {};
            vm.cancel = cancel;
            vm.update = update;
            vm.getToastPosition = getToastPosition;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            };
            function update(c) {
                vm.caseData = angular.copy(c);
                console.log(vm.caseData);
                $mdDialog.cancel();
                notifyCaseSaved();

                // When submitting, do something with the case data
                caseService.createCase(vm.caseData);
            };
          
          
            // When the form is submitted, show a notification:
          
            vm.toastPosition = {
                bottom: true,
                top: false,
                left: false,
                right: true
            };
            function getToastPosition() {
                return Object.keys(vm.toastPosition)
                  .filter(function(pos) { return vm.toastPosition[pos]; })
                  .join(' ');
            };

            function notifyCaseSaved() {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Case ' + vm.caseData.title + ' created')
                        .position(vm.getToastPosition())
                        .hideDelay(3000)
                );
            };
          
        };

        function getAuthorities() {
            return userService.getAuthorities().then(function(response) {
                vm.authorities = response;
                return response;
            });
        }
        
        function getCaseTypes() {
            return caseService.getCaseTypes().then(function(response) {
                return response;
            });
        }

    /*
      $scope.myUpdatedCases = countMyUpdatedCases();
      
      function countMyUpdatedCases() {
        var i = 0;
        for (var c in $scope.cases) {
          if ($scope.cases[c].isUpdated) {
            i++;
          };
        }
        return i;
      };
      
      $scope.unassignedCasesNum = countUnassignedCases();
      
      function countUnassignedCases() {
        var i = 0;
        for (var c in $scope.cases) {
          if ($scope.cases[c].assignee === '') {
            i++;
          };
        }
        return i;
      };
      
      $scope.casesNeedAction = countCasesNeedAction();
      
      function countCasesNeedAction() {
        return countUnassignedCases() + countMyUpdatedCases();
      };
    */  
  
  };
  
})();
