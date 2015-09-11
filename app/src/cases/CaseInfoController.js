(function(){

  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);

  CaseInfoController.$inject = ['$scope', '$stateParams', '$mdDialog', '$translate', 'caseService'];
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param $stateParams
   * @param $mdDialog
   * @param $translate
   * @param caseService
   * @constructor
   */
  function CaseInfoController($scope, $stateParams, $mdDialog, $translate, caseService) {
    var vm = this;

    vm.editCase = editCase;
    vm.changeCaseStatus = changeCaseStatus;
    vm.onTabChange = onTabChange;

    loadCaseInfo();
    
    function loadCaseInfo(){
        caseService.getCaseInfo($stateParams.caseId).then(function(result){
            $scope.case = result.properties;
            $scope.caseIsLocked = result.isLocked;
            $scope.caseStatusChoices = result.statusChoices;
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

    function changeCaseStatus(status) {
      function confirmCloseCase() {
        // TODO: Check if there are any unlocked documents in the case and
        // notify the user in the confirmation dialog.

        var confirm = $mdDialog.confirm()
            .title($translate.instant("common.CONFIRM"))
            .content($translate.instant("CASEINFO.CONFIRM_CLOSE_CASE"))
            .ariaLabel($translate.instant("CASEINFO.CONFIRM_CLOSE_CASE"))
            .ok($translate.instant("common.OK"))
            .cancel($translate.instant("common.CANCEL"));
        return $mdDialog.show(confirm);
      }

      var changeCaseStatusImpl = function () {
        caseService.changeCaseStatus($stateParams.caseId, status).then(function (json) {
          loadCaseInfo();
          // TODO: Display a toast message?
        });
      };

      if (status === "closed") {
        confirmCloseCase().then(function () {
          changeCaseStatusImpl();
        });
      } else {
        changeCaseStatusImpl();
      }
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
    
    function onTabChange(tabName){
        $scope.$broadcast('tabSelectEvent', { tab: tabName});
    }
    
  };

})();
