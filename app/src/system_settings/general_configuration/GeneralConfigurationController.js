
angular
        .module('openeApp.systemsettings')
        .controller('GeneralConfigurationController', GeneralConfigurationController);

function GeneralConfigurationController($mdDialog, $translate, notificationUtilsService,
        oeParametersService) {
    var vm = this;
    vm.parameters = [];
    vm.loadList = loadList;
    vm.saveParameters = saveParameters;

    vm.loadList();

    function loadList() {
        oeParametersService.getParameters().then(function(data) {
            vm.parameters = data;
            return data;
        });
    }

    function saveParameters(ev) {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('ADMIN.SYS_SETTINGS.GENERAL.ARE_YOU_SURE_YOU_WANT_TO_SAVE_PARAMETERS'))
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            oeParametersService.saveParameters(vm.parameters).then(function() {
                notificationUtilsService.notify($translate.instant("ADMIN.SYS_SETTINGS.GENERAL.SAVED_SUCCESSFULLY"));
            }, function(response) {
                notificationUtilsService.alert(response.data.message || response.statusText);
            });
        });
    }
}