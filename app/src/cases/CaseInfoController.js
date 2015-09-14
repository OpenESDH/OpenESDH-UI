(function(){

  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);

  CaseInfoController.$inject = ['$scope', '$stateParams', '$mdDialog', '$translate', 'caseService', 'notificationUtilsService'];
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param $stateParams
   * @param $mdDialog
   * @param $translate
   * @param caseService
   * @constructor
   */
  function CaseInfoController($scope, $stateParams, $mdDialog, $translate, caseService, notificationUtilsService) {
    var vm = this;

    vm.editCase = editCase;
    vm.changeCaseStatus = changeCaseStatus;
    vm.onTabChange = onTabChange;

    loadCaseInfo();
    
    function loadCaseInfo(){
        console.log($stateParams);
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
            .title($translate.instant("COMMON.CONFIRM"))
            .content($translate.instant("CASE.CONFIRM_CLOSE_CASE"))
            .ariaLabel($translate.instant("CASE.CONFIRM_CLOSE_CASE"))
            .ok($translate.instant("COMMON.OK"))
            .cancel($translate.instant("COMMON.CANCEL"));
        return $mdDialog.show(confirm);
      }

      var changeCaseStatusImpl = function () {
        caseService.changeCaseStatus($stateParams.caseId, status).then(function (json) {
          loadCaseInfo();
          // TODO: Documents listing also needs to be reloaded
          notificationUtilsService.notify($translate.instant("CASE.STATUS_CHANGED_SUCCESS"));
        }).catch(function (e) {
          notificationUtilsService.notify(e.message)
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
