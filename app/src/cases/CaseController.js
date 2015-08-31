(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController)
        .run(function(authService, $q) {
            // This is just a hack, until we get a login page
            $q.resolve(authService.login('admin', 'admin'));
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
    
  };
  

})();
