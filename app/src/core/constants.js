
    angular
        .module('openeApp.core')
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        })
        .constant('ALFRESCO_URI', {
            apiProxy: '/alfresco/api/',
            serviceApiProxy: '/alfresco/service/api/',
            serviceSlingshotProxy: '/alfresco/service/slingshot/'
        });