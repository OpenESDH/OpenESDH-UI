(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

    CaseController.$inject = ['$scope', '$mdDialog', '$location', 'caseService', 'userService'];

    /**
     * Main Controller for the Cases module
     * @param $scope
     * @param cases
     * @constructor
     */
    function CaseController($scope, $mdDialog, $location, caseService, userService) {
        var vm = this;
        vm.cases = [];

        vm.getCases = getCases;
        vm.createCase = createCase;
        vm.getMyCases = getMyCases;

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

        function getMyCases() {
            return caseService.getMyCases().then(function(response) {
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

        CaseCreateDialogController.$inject = ['$scope', '$mdDialog', '$animate', 'notificationUtilsService'];
        function CaseCreateDialogController($scope, $mdDialog, $animate, notificationUtilsService) {
            var vm = this;
          
            // Data from the case creation form
            vm.caseData = {};
            vm.cancel = cancel;
            vm.update = update;

            // Cancel or submit form in dialog
            function cancel(form) {
                $mdDialog.cancel();
            }
            function update(c) {
                vm.caseData = angular.copy(c);
                console.log(vm.caseData);
                $mdDialog.cancel();

                // When submitting, do something with the case data
                caseService.createCase(vm.caseData).then(function (caseId) {
                    //cases/case/20150908-865
                    $location.path("/cases/case/" + caseId);
                    // When the form is submitted, show a notification:
                    notificationUtilsService.notify('Case ' + vm.caseData.title + ' created');
                }).catch(function (e) {
                    notificationUtilsService.notify('Error creating case: ' + e.message);
                });
            }
        }

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
