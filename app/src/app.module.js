(function() {
    'use strict';

    angular
        .module('openeApp', [
            'ngMaterial',
            'ui.router',
            'ngResource',
            'pascalprecht.translate',
            'isteven-multi-select',
            'openeApp.cases',
            'openeApp.dashboard',
            'openeApp.files',
            'openeApp.tasks',
            'openeApp.documents',
            'openeApp.notes'
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
                console.log('next: ', next);
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

    config.$inject = ['$mdThemingProvider', '$translateProvider', '$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

    function config($mdThemingProvider, $translateProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            abstract: true,
            resolve: {
                authorize: ['authService', function(authService) {
                    console.log(authService);
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
        });
        $translateProvider
            .translations('en', en_translations)
            .preferredLanguage('en');
    }

    var en_translations = {
        CASEINFO: {
          ID: 'Case ID',
          TITLE: 'Case title',
          STATUS: 'Status',
          CREATEDBY: 'Created by',
          CREATED: 'Created',
          CASEOWNERS: 'Case owners',
          MODIFIED: 'Last modified',
          DESCRIPTION: 'Description'
        },
            
        document:{
            status:{
                received: 'Received',
                distributed: 'Distributed',
                draft: 'Draft',
                'under-review': 'Under review',
                published: 'Published',
                finalised: 'Finalised',
                submitted: 'Submitted'
            },
            category:{
                annex: 'Annex',
                proof: 'Proof',
                contract: 'Contract',
                note: 'Note',
                report: 'Report',
                proxy: 'Proxy',
                warranty: 'Warranty',
                part: 'Part',
                statement: 'Statement',
                summary: 'Summary',
                accounting: 'Accounting',
                offers: 'Offers',
                other: 'Other'
            },
            type:{
                invoice: 'Invoice',
                letter: 'Letter',
                note: 'Note',
                report: 'Report',
                agenda: 'Agenda',
                other: 'Other'
            }
        }
    };
})();