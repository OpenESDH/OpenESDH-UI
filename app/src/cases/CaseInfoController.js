(function(){

  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);

  CaseInfoController.$inject = ['$scope', '$stateParams', '$mdDialog', 'caseService'];
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param cases
   * @constructor
   */
  function CaseInfoController($scope, $stateParams, $mdDialog, caseService) {
    
    init();
    
    function init(){
        caseService.getCaseInfo($stateParams.caseId).then(function(result){
            $scope.case = result.properties;
        });
    }
    
    $scope.editCase = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/src/cases/view/caseCrudDialog.html',
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
