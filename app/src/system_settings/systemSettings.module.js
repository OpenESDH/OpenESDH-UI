angular
        .module('openeApp.systemsettings', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(systemSettingsPagesServiceProvider, $stateProvider, USER_ROLES){
    systemSettingsPagesServiceProvider.addPage('ADMIN.SYS_SETTINGS.GENERAL.GENERAL_CONFIG', 'administration.systemsettings.general');
    systemSettingsPagesServiceProvider.addPage('DOCUMENT_TYPES.DOCUMENT_TYPES', 'administration.systemsettings.doctypes');
    systemSettingsPagesServiceProvider.addPage('DOCUMENT_CATEGORIES.DOCUMENT_CATEGORIES', 'administration.systemsettings.doccategories');
    systemSettingsPagesServiceProvider.addPage('PARTY_ROLES.PARTY_ROLES', 'administration.systemsettings.partyroles');
    
    systemSettingsPagesServiceProvider.addPage('ADMIN.SYS_SETTINGS.TENANTS_MODULES.TITLE', 'administration.systemsettings.tenantsmodules');
    
    $stateProvider.state('administration.systemsettings', {
        url: '/system-settings',
        data: {
            authorizedRoles: [USER_ROLES.admin],
            selectedTab: 4
        },
        views: {
            'systemsettings': {
                templateUrl: 'app/src/system_settings/menu/system_settings.html',
                controller: 'SystemSettingsController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.systemsettings.general', {
        url: '/general-configuration',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/general_configuration/view/generalConfiguration.html',
                controller: 'GeneralConfigurationController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.systemsettings.doctypes', {
        url: '/document-types',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/classif/view/classifValues.html',
                controller: 'DocumentTypesController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.systemsettings.doccategories', {
        url: '/document-categories',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/classif/view/classifValues.html',
                controller: 'DocumentCategoriesController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.systemsettings.partyroles', {
        url: '/party-roles',
        data: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/classif/view/classifValues.html',
                controller: 'PartyRolesController',
                controllerAs: 'vm'
            }
        }
    }).state('administration.systemsettings.tenantsmodules', {
        url: '/tenantsmodules',
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/tenant/view/tenantsModules.html',
                controller: 'TenantsModulesController',
                controllerAs: 'vm'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    });
}