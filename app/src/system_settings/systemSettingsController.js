angular
    .module('openeApp.systemsettings')
    .controller('SystemSettingsController', SystemSettingsCtrl);

function SystemSettingsCtrl(systemSettingsPagesService, authService) {
    var vm = this;
    var isTenant = authService.getUserInfo().user.userName.indexOf("@") !== -1;
    vm.pages = systemSettingsPagesService.getPages()
        .filter(function (page) {
            if (isTenant) {
                return page.sref !== 'administration.systemsettings.tenantsmodules';
            }
            return true;
        });
    vm.modulesPages = systemSettingsPagesService.getModulesPages();
}