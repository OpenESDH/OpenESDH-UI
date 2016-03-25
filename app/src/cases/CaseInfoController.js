
angular
        .module('openeApp.cases')
        .controller('CaseInfoController', CaseInfoController);

/*
 * Main CaseInfoController for the Cases module
 * @param $scope
 * @param $stateParams
 * @param startCaseWorkflowService
 * @param caseCrudDialogService
 * @param casePrintDialogService
 * @param preferenceService
 * @constructor
 */
function CaseInfoController($scope, $stateParams, startCaseWorkflowService, caseCrudDialogService,
        casePrintDialogService, preferenceService, caseInfoExtrasService, notificationUtilsService, $translate) {
    var vm = this;
    vm.editCase = editCase;
    vm.startWorklfow = startWorklfow;
    vm.printCase = printCase;
    vm.addCaseToFavourites = addCaseToFavourites;
    vm.removeCaseFromFavourites = removeCaseFromFavourites;
    vm.extras = caseInfoExtrasService.getExtrasControllers();

    loadCaseInfo();

    function loadCaseInfo() {
        //get caseInfo from parent controler: CaseController as caseCtrl
        $scope.caseCtrl.getCaseInfo($stateParams.caseId).then(function(result) {
            vm.caseInfo = result;
            vm.caseInfoFormUrl = caseCrudDialogService.getCaseInfoFormUrl(result.type);
            $scope.case = result.properties;
            checkFavourite();
        });
    }

    function editCase() {
        var promise = caseCrudDialogService.editCase(vm.caseInfo);
        if(promise != null && promise != undefined){
            promise.then(function(result) {
                loadCaseInfo();
            });            
        }
    }

    function startWorklfow() {
        startCaseWorkflowService.startWorkflow(vm.caseInfo);
    }

    function printCase() {
        casePrintDialogService.printCase($stateParams.caseId);
    }

    function addCaseToFavourites() {
        preferenceService.addFavouriteCase($stateParams.caseId).then(function() {
            checkFavourite();
            notificationUtilsService.alert($translate.instant('CASE.CASE_ADDED_TO_FAVORITE'));
        });
    }

    function removeCaseFromFavourites() {
        preferenceService.removeFavouriteCase($stateParams.caseId).then(function() {
            checkFavourite();
        });
    }

    function checkFavourite() {
        preferenceService.isFavouriteCase($stateParams.caseId).then(function(result) {
            vm.isFavourite = result;
        });
    }
}