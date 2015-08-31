(function(){

  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);

  CaseInfoController.$inject = ['$scope', '$routeParams', '$mdDialog', 'caseService'];
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param cases
   * @constructor
   */
  function CaseInfoController($scope, $routeParams, $mdDialog, caseService) {
    
    init();
    
    function init(){
        caseService.getCaseInfo($routeParams.caseId).then(function(result){
            $scope.case = result.properties;
        });
    }
    
    $scope.createCase = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'src/cases/view/caseCrudDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };
    
    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };
    
  };

})();
