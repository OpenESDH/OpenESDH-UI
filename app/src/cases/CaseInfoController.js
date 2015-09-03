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
    var vm = this;

    vm.editCase = editCase;

    init();
    
    function init(){
        caseService.getCaseInfo($stateParams.caseId).then(function(result){
            $scope.case = result.properties;
        });
    }
    
    function editCase(ev) {
      $mdDialog.show({
        controller: DialogController,
        controllerAs: 'vm',
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
    }
    
    function DialogController($scope, $mdDialog) {
      var vm = this;
      vm.cancel = cancel;
      vm.hide = hide;

      function hide() {
        $mdDialog.hide();
      };
      function cancel() {
        $mdDialog.cancel();
      };
    }
    
  };

})();
