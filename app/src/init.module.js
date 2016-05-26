angular
        .module('openeApp.init', ['ngMaterial'])
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user'
                    //guest: 'guest' we don't want this type of user as of yet
        })
        .constant('ALFRESCO_URI', {
            apiProxy: '/alfresco/api/',
            serviceApiProxy: '/api/',
            serviceSlingshotProxy: '/slingshot/',
            webClientServiceProxy: '/alfresco/wcs'
        })
        .constant('PATTERNS', {
            fileName: /^[a-zA-Z0-9_\-,!@#$%^&()=+ ]+$/,
            phone: /^[+]?[0-9\- ]+$/
        })
        .constant('APP_CONFIG', {
            appName: 'OpenESDH',
            logoSrc: './app/assets/images/logo-light.svg'
        });