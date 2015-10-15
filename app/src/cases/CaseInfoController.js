
  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param $stateParams
   * @param $mdDialog
   * @param $translate
   * @param caseService
   * @constructor
   */
  function CaseInfoController($scope, $stateParams, $mdDialog, $translate, $filter, caseService, 
              notificationUtilsService, startCaseWorkflowService, caseCrudDialogService, casePrintDialogService) {
    var vm = this;

    vm.editCase = editCase;
    vm.changeCaseStatus = changeCaseStatus;
    vm.onTabChange = onTabChange;
    vm.startWorklfow = startWorklfow;
    vm.printCase = printCase;
    $scope.$filter = $filter;

    loadCaseInfo();
    
    function loadCaseInfo(){
        caseService.getCaseInfo($stateParams.caseId).then(function(result){
            vm.caseInfo = result;
            vm.caseInfoTemplateUrl = caseCrudDialogService.getCaseInfoTemplateUrl(result.properties.type);
            $scope.case = result.properties;
            $scope.caseIsLocked = result.isLocked;
            $scope.caseStatusChoices = result.statusChoices;
        });
    }
    
    function editCase(ev) {
        caseCrudDialogService.editCase(vm.caseInfo).then(function(result){
            loadCaseInfo();
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
        }, function (response) {
          notificationUtilsService.alert(response.data.message);
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
    
    function onTabChange(tabName){
        $scope.$broadcast('tabSelectEvent', { tab: tabName});
    }
    
    function startWorklfow(){
        startCaseWorkflowService.startWorkflow();
    }
    
    function printCase(){
        casePrintDialogService.printCase($stateParams.caseId);
    }
    
  };
