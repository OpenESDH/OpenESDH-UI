(function(){

  angular
       .module('openeApp.cases')
       .controller('CaseInfoController', CaseInfoController);

  CaseInfoController.$inject = ['$scope', '$stateParams', '$mdDialog', '$translate', 'caseService', 
                                'notificationUtilsService', 'startCaseWorkflowService', 'caseCrudDialogService'];
  
  /**
   * Main CaseInfoController for the Cases module
   * @param $scope
   * @param $stateParams
   * @param $mdDialog
   * @param $translate
   * @param caseService
   * @constructor
   */
  function CaseInfoController($scope, $stateParams, $mdDialog, $translate, caseService, 
              notificationUtilsService, startCaseWorkflowService, caseCrudDialogService) {
    var vm = this;

    vm.editCase = editCase;
    vm.changeCaseStatus = changeCaseStatus;
    vm.onTabChange = onTabChange;
    vm.startWorklfow = startWorklfow;

    loadCaseInfo();
    
    function loadCaseInfo(){
        caseService.getCaseInfo($stateParams.caseId).then(function(result){
            $scope.case = result.properties;
            $scope.caseIsLocked = result.isLocked;
            $scope.caseStatusChoices = result.statusChoices;
        });
    }
    
    function editCase(ev) {
        var c = $scope.case;
        var caseObj = {
            title: c['cm:title'].displayValue,
            owner: c['base:owners'].nodeRef[0],
            journalKey: [],
            journalFacet: [],
            startDate: new Date(c['base:startDate'].value),
            description: c['cm:description'].displayValue,
            nodeRef: c.nodeRef
        };
        if(c['oe:journalKey'].value){
            caseObj.journalKey.push(c['oe:journalKey'].value);    
        }
        if(c['oe:journalFacet'].value){
            caseObj.journalFacet.push(c['oe:journalFacet'].value);
        }
        
        caseCrudDialogService.editCase(caseObj).then(function(result){
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
    
  };

})();
