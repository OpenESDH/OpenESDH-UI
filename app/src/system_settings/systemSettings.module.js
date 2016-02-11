angular
        .module('openeApp.systemsettings', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(systemSettingsPagesServiceProvider){
    systemSettingsPagesServiceProvider.addPage('ADMIN.SYS_SETTINGS.GENERAL.GENERAL_CONFIG', 'administration.systemsettings.general');
    systemSettingsPagesServiceProvider.addPage('DOCUMENT_TYPES.DOCUMENT_TYPES', 'administration.systemsettings.doctypes');
    systemSettingsPagesServiceProvider.addPage('DOCUMENT_CATEGORIES.DOCUMENT_CATEGORIES', 'administration.systemsettings.doccategories');
    
    systemSettingsPagesServiceProvider.addPage('ADMIN.SYS_SETTINGS.TENANTS_MODULES.TITLE', 'administration.systemsettings.tenantsmodules');
}