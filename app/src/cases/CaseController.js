(function(){
  'use strict';

  angular
      .module('openeApp.cases')
      .controller('CaseController', CaseController)
      .run(function(authService, $q) {
          // This is just a hack, until we get a login page
          $q.resolve(authService.login('admin', 'openeadmin'));
     });

  CaseController.$inject = ['$scope', '$mdDialog', 'caseService'];

  /**
   * Main Controller for the Cases module
   * @param $scope
   * @param cases
   * @constructor
   */
  function CaseController($scope, $mdDialog, caseService) {
        var vm = this;
        vm.cases = [];

        vm.getCases = getCases;

        activate();

        function activate() {
            return getCases().then(function() {

            });
        }

        function getCases() {
            return caseService.getCases('base:case').then(function(response) {
                vm.cases = response;
                return vm.cases;
            }, function(error) {
                console.log(error);
            });
        }
        
        $scope.createCase = function(ev, caseType) {
          
          // In the future, we'll need the ability to create other types of cases
          console.log('Creating a new case of type ' + caseType);
          
          $mdDialog.show({
            controller: CaseCreateDialogController,
            templateUrl: 'app/src/cases/view/caseCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          });
        };
        
        function CaseCreateDialogController($scope, $mdDialog, $mdToast, $animate) {
          
          // Data from the case creation form
          $scope.caseData = {};
          
          // Cancel or submit form in dialog 
          $scope.cancel = function(form) {
            $mdDialog.cancel();
          };
          $scope.update = function(c) {
            $scope.caseData = angular.copy(c);
            $mdDialog.cancel();
            $scope.notifyCaseSaved();
            
            // When submitting, do something with the case data
            console.log($scope.caseData);
          };
          
          
          // When the form is submitted, show a notification:
          
          $scope.toastPosition = {
            bottom: true,
            top: false,
            left: false,
            right: true
          };
          $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
              .filter(function(pos) { return $scope.toastPosition[pos]; })
              .join(' ');
          };
          $scope.notifyCaseSaved = function() {
            $mdToast.show(
              $mdToast.simple()
                .content('Case ' + $scope.caseData.title + ' created')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          };
          
        };
        

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
