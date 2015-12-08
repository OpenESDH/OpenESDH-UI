
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
}