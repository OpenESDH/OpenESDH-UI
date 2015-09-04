(function() {
    'use strict';

    angular
        .module('openeApp', [
            'ngMaterial',
            'ui.router',
            'ngResource',
            'isteven-multi-select',
            'openeApp.translations',
            'openeApp.cases',
            'openeApp.dashboard',
            'openeApp.files',
            'openeApp.tasks',
            'openeApp.notes',
            'openeApp.documents',
            'openeApp.contacts'
        ])
        .config(config)
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        })
        .run(function($rootScope, $state, $stateParams, authService) {
            $rootScope.$on('$stateChangeStart', function(event, next, params) {
//                $rootScope.toState = next;
//                $rootScope.toStateParams = params;
                if (next.data.authorizedRoles.length == 0) {
                    return;
                }
                if (authService.isAuthenticated()) {

                } else {
                    event.preventDefault();
                    $state.go('login');
                }
//                console.log('authenticated? ', authService.isAuthenticated());
//                if (!authService.isAuthenticated()) {
//                    event.preventDefault();
//                    $state.go('login');
//                }
            });
        });

    config.$inject = ['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

    function config($mdThemingProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            abstract: true,
            resolve: {
                authorize: ['authService', function(authService) {
                }]
            }
        }).state('dashboard', {
            parent: 'site',
            url: '/',
            views: {
                'content@': {
                    templateUrl: '/app/src/dashboard/view/dashboard.html',
                    controller: 'DashboardController'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('cases', {
            parent: 'site',
            url: '/cases',
            views: {
                'content@': {
                    templateUrl: '/app/src/cases/view/cases.html',
                    controller: 'CaseController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('caseinfo', {
            parent: 'site',
            url: '/cases/case/:caseId',
            views: {
                'content@': {
                    templateUrl: '/app/src/cases/view/case.html',
                    controller: 'CaseInfoController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('docDetails', {
            parent: 'site',
            url: '/cases/case/:caseId/doc/:storeType/:storeId/:id', 
            views: {
                'content@': {
                    controller : 'DocumentDetailsController',
                    templateUrl : 'app/src/documents/view/document.html',
                    controllerAs: 'docCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        })
        .state('login', {
            parent: 'site',
            url: '/login',
            views: {
                'content@': {
                    templateUrl: '/app/src/authentication/view/login.html',
                    controller: 'AuthController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: []
            }
        }).state('files', {
            parent: 'site',
            url: '/files',
            views: {
                'content@': {
                    templateUrl : '/app/src/files/view/files.html',
                    controller : 'FileController'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('tasks', {
            parent: 'site',
            url: '/tasks',
            views: {
                'content@': {
                    templateUrl : '/app/src/tasks/view/tasks.html',
                    controller : 'TaskController'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('organizations', {
            parent: 'site',
            url: '/organizations',
            views: {
                'content@': {
                    templateUrl : '/app/src/contacts/view/organizations.html',
                    controller : 'OrganizationController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('organization', {
            parent: 'site',
            url: '/organizations/organization/:storeProtocol/:storeIdentifier/:uuid',
            views: {
                'content@': {
                    templateUrl : '/app/src/contacts/view/organization.html',
                    controller : 'OrganizationController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('contacts', {
            parent: 'site',
            url: '/contacts',
            views: {
                'content@': {
                    templateUrl : '/app/src/contacts/view/persons.html',
                    controller : 'PersonsController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('contact', {
            parent: 'site',
            url: '/contacts/person/:storeProtocol/:storeIdentifier/:uuid',
            views: {
                'content@': {
                    templateUrl : '/app/src/contacts/view/personCrud.html',
                    controller : 'PersonCrudController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('contactNew', {
            parent: 'site',
            url: '/contacts/person/create',
            views: {
                'content@': {
                    templateUrl : '/app/src/contacts/view/personCrud.html',
                    controller : 'PersonCrudController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        });
    }
    
})();
