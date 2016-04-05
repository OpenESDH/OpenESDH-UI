
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
    vm.checkFavourite = checkFavourite;
    vm.loadCaseInfo = loadCaseInfo; 
    vm.reloadCaseInfo = reloadCaseInfo;

    vm.loadCaseInfo();

    function loadCaseInfo() {
        var vm = this;
        //get caseInfo from parent controler: CaseController as caseCtrl
        $scope.caseCtrl.getCaseInfo($stateParams.caseId).then(function(result) {
            vm.caseInfo = result;
            vm.caseInfoFormUrl = caseCrudDialogService.getCaseInfoFormUrl(result.type);
            $scope.case = result.properties;
            vm.checkFavourite();
        });
    }
    
    function reloadCaseInfo(){
        $scope.caseCtrl.loadCaseInfo();
        var vm = this;
        vm.loadCaseInfo();
    }

    function editCase() {
        var vm = this;
        var promise = caseCrudDialogService.editCase(vm.caseInfo);
        if(promise != null && promise != undefined){
            promise.then(function(result) {
                vm.loadCaseInfo();
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
        var vm = this;
        preferenceService.addFavouriteCase($stateParams.caseId).then(function() {
            vm.checkFavourite();
            notificationUtilsService.alert($translate.instant('CASE.CASE_ADDED_TO_FAVORITE'));
        });
    }

    function removeCaseFromFavourites() {
        var vm = this;
        preferenceService.removeFavouriteCase($stateParams.caseId).then(function() {
            vm.checkFavourite();
        });
    }

    function checkFavourite() {
        var vm = this;
        preferenceService.isFavouriteCase($stateParams.caseId).then(function(result) {
            vm.isFavourite = result;
        });
    }
}