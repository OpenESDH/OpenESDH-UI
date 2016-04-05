
angular
        .module('openeApp.cases')
        .controller('CaseController', CaseController);

function CaseController($scope, $stateParams, $mdDialog, $translate, caseService, notificationUtilsService, $q) {
    var vm = this;
    vm.changeCaseStatus = changeCaseStatus;
    vm.getCaseInfo = getCaseInfo;
    vm.loadCaseInfo = loadCaseInfo;

    var _caseInfoDefer = null;

    vm.loadCaseInfo();
    initTab();

    function initTab() {
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            $scope.currentTab = toState.data.selectedTab;
        });
    }

    function loadCaseInfo() {
        _caseInfoDefer = $q.defer();
        var vm = this;
        caseService.getCaseInfo($stateParams.caseId).then(function(result) {
            _caseInfoDefer.resolve(result);
            vm.caseInfo = result;
            vm.case = result.properties;
            vm.caseStatusChoices = result.statusChoices;
            vm.caseIsLocked = result.isLocked;
        }, function(response) {
            _caseInfoDefer.reject();
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

    function getCaseInfo() {
        return _caseInfoDefer.promise;
    }
}