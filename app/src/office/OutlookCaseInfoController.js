
angular
        .module('openeApp.office')
        .controller('OutlookCaseInfoController', OutlookCaseInfoController);

function OutlookCaseInfoController($filter, $stateParams, $translate, sessionService, caseService, authService,
        notificationUtilsService) {
    var vm = this;
    vm.dateFlt=$filter('openeDate');
    
    if ($stateParams.alf_ticket && !sessionService.getUserInfo()) {
        sessionService.setUserInfo({ticket: $stateParams.alf_ticket});
        authService.revalidateUser();
    }

    loadCaseInfo();

    function loadCaseInfo() {
        caseService.getCaseInfo($stateParams.caseId).then(function(result) {
            vm.hasData = true;
            vm.case = result.properties;
        }, function(error) {
            vm.hasData = false;
            if (error.domain) {
                notificationUtilsService.alert(error.message);
            }
        });
    }
}