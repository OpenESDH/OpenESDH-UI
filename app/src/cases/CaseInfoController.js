
angular
        .module('openeApp.cases')
        .controller('CaseInfoController', CaseInfoController);

/*
 * Main CaseInfoController for the Cases module
 * @param $scope
 * @param $stateParams
 * @param $mdDialog
 * @param $translate
 * @param caseService
 * @constructor
 */
function CaseInfoController($scope, $stateParams, $mdDialog, $translate, caseService, notificationUtilsService,
        startCaseWorkflowService, caseCrudDialogService, casePrintDialogService, preferenceService) {
    var vm = this;
    vm.editCase = editCase;
    vm.changeCaseStatus = changeCaseStatus;
    vm.onTabChange = onTabChange;
    vm.startWorklfow = startWorklfow;
    vm.printCase = printCase;
    vm.addCaseToFavourites = addCaseToFavourites;
    vm.removeCaseFromFavourites = removeCaseFromFavourites;
    vm.checkFavourite = checkFavourite;

    loadCaseInfo();

    function loadCaseInfo() {
        caseService.getCaseInfo($stateParams.caseId).then(function(result) {
            vm.hasData = true;
            vm.caseInfo = result;
            vm.caseInfoTemplateUrl = caseCrudDialogService.getCaseInfoTemplateUrl(result.type);
            $scope.case = result.properties;
            $scope.caseIsLocked = result.isLocked;
            $scope.caseStatusChoices = result.statusChoices;
            vm.checkFavourite();
        }, function(response) {
            vm.hasData = false;
            if (response.status === 400) {
                //bad reqest (might be handled exception)
                //CASE.CASE_NOT_FOUND
                var key = 'CASE.' + response.data.message.split(' ')[1];
                var msg = $translate.instant(key);
                notificationUtilsService.alert(msg === key ? response.data.message : msg);
                return;
            }
            //other exceptions
            notificationUtilsService.alert(response.data.message);
        });
    }

    function editCase(ev) {
        caseCrudDialogService.editCase(vm.caseInfo).then(function(result) {
            loadCaseInfo();
        });
    }

    function changeCaseStatus(status) {
        function confirmCloseCase() {
            // TODO: Check if there are any unlocked documents in the case and
            // notify the user in the confirmation dialog.

            var confirm = $mdDialog.confirm()
                    .title($translate.instant("COMMON.CONFIRM"))
                    .textContent($translate.instant("CASE.CONFIRM_CLOSE_CASE"))
                    .ariaLabel($translate.instant("CASE.CONFIRM_CLOSE_CASE"))
                    .ok($translate.instant("COMMON.OK"))
                    .cancel($translate.instant("COMMON.CANCEL"));
            return $mdDialog.show(confirm);
        }

        var changeCaseStatusImpl = function() {
            caseService.changeCaseStatus($stateParams.caseId, status).then(function(json) {
                loadCaseInfo();
                // TODO: Documents listing also needs to be reloaded
                notificationUtilsService.notify($translate.instant("CASE.STATUS_CHANGED_SUCCESS"));
            }, function(response) {
                notificationUtilsService.alert(response.data.message);
            });
        };

        if (status === "closed") {
            confirmCloseCase().then(function() {
                changeCaseStatusImpl();
            });
        } else {
            changeCaseStatusImpl();
        }
    }

    function onTabChange(tabName) {
        $scope.$broadcast('tabSelectEvent', {tab: tabName});
    }

    function startWorklfow() {
        startCaseWorkflowService.startWorkflow();
    }

    function printCase() {
        casePrintDialogService.printCase($stateParams.caseId);
    }

    function addCaseToFavourites() {
        preferenceService.addFavouriteCase($stateParams.caseId).then(function() {
            vm.checkFavourite();
        });
    }

    function removeCaseFromFavourites() {
        preferenceService.removeFavouriteCase($stateParams.caseId).then(function() {
            vm.checkFavourite();
        });
    }

    function checkFavourite() {
        preferenceService.isFavouriteCase($stateParams.caseId).then(function(result) {
            vm.isFavourite = result;
        });
    }
}