
    angular
        .module('openeApp.office')
        .config(configure);

    function configure($stateProvider) {
//    function configure($stateProvider) {
        $stateProvider.state('outlook', {
            parent: 'site',
            url: '/outlook?alf_ticket',
            views: {
                'content@': {
                    templateUrl: '/app/src/office/view/outlook.html',
                    controller: 'OfficeController',
                    controllerAs: 'vm'
                }
            },
            data: {
//                authorizedRoles: [USER_ROLES.user]
//                authorizedRoles: ['user']
                authorizedRoles: []
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
        }).state('office', {
            parent: 'site',
            url: '/office?alf_ticket',
            views: {
                'content@': {
                    templateUrl: '/app/src/office/view/office.html',
                    controller: 'OfficeController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: []
            }
        });
    }