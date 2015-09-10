(function(){
    'use strict';

    angular.module('openeApp.office').config(configure);

//    configure.$inject = ['$stateProvider', 'USER_ROLES'];
    configure.$inject = ['$stateProvider'];

    function configure($stateProvider, USER_ROLES) {
//    function configure($stateProvider) {
        console.log('in configure', USER_ROLES);

        $stateProvider.state('outlook', {
            parent: 'site',
            url: '/outlook',
            views: {
                'content@': {
                    templateUrl: '/app/src/office/view/outlook.html',
                    controller: 'OfficeController',
                    controllerAs: 'vm'
                }
            },
            data: {
//                authorizedRoles: [USER_ROLES.user]
                authorizedRoles: ['user']
            }
        }).state('outlook.caseinfo', {
            parent: 'site',
            url: '/outlook/case/:caseId',
            views: {
                'content@': {
                    templateUrl: '/app/src/office/view/caseInfo.html',
                    controller: 'CaseInfoController',
                    controllerAs: 'vm'
                }
            },
            data: {
//                authorizedRoles: [USER_ROLES.user]
                authorizedRoles: ['user']
            }
        });
    }
})();
