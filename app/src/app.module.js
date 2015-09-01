(function() {
    'use strict';

    angular
        .module('openeApp', [
            'ngMaterial',
            'ngRoute',
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
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        })
        .run(function($rootScope, authService, AUTH_EVENTS) {
            $rootScope.$on('$stateChangeStart', function(event, next) {
                console.log(event, next);
                var authorizedRoles = next.data.authorizedRoles;
                if (!authService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (authService.isAuthenticated()) {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });
        });

    config.$inject = ['$mdThemingProvider', '$translateProvider', '$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

    function config($mdThemingProvider, $translateProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {
        console.log('config');
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'app/src/dashboard/view/dashboard.html',
            controller: 'DashboardController',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
            }
        }).state('cases', {
            url: '/cases',
            templateUrl: 'app/src/cases/view/cases.html',
            controller: 'CaseController'
        }).state('login', {
            url: '/login',
            templateUrl: 'app/src/authentication/view/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
            }
        });
        $translateProvider
            .translations('en', en_translations)
            .preferredLanguage('en');
    }

//<<<<<<< HEAD
//
//
//  function config2($mdThemingProvider, $routeProvider) {
//
//      $mdThemingProvider.theme('default')
//        .primaryPalette('blue')
//        .accentPalette('orange');
//
//      $routeProvider
//        .when('/', {
//          controller: 'DashboardController',
//          templateUrl: 'app/src/dashboard/view/dashboard.html'
//        })
//        .when('/login', {
//          controller: 'LoginController',
//          controllerAs: 'vm',
//          templateUrl: 'app/src/authentication/view/login.html'
//=======
//
//    angular
//        .module('openeApp', [ 'ngMaterial', 'ngRoute', 'ngResource', 'pascalprecht.translate', 'isteven-multi-select', 'openeApp.cases', 'openeApp.dashboard', 'openeApp.files', 'openeApp.tasks', 'openeApp.documents', 'openeApp.notes', 'openeApp.organisations' ])
//        .config(config);
//
//    config.$inject = [ '$mdThemingProvider', '$routeProvider', '$translateProvider' ];
//
//    function config($mdThemingProvider, $routeProvider, $translateProvider) {
//
//        $mdThemingProvider.theme('default')
//            .primaryPalette('blue')
//            .accentPalette('orange');
//
//        $routeProvider.when('/', {
//            controller : 'DashboardController',
//            templateUrl : 'app/src/dashboard/view/dashboard.html'
//        }).when('/login', {
//            templateUrl : 'app/src/authentication/view/login.html'
//        }).when('/logout', {
//            templateUrl : 'app/src/authentication/view/logout.html'
//        }).when('/cases/', {
//            controller : 'CaseController',
//            controllerAs : 'vm',
//            templateUrl : 'app/src/cases/view/cases.html'
//        }).when('/cases/case/:caseId', {
//            controller : 'CaseInfoController',
//            templateUrl : 'app/src/cases/view/case.html'
//        }).when('/files/', {
//            controller : 'FileController',
//            templateUrl : 'app/src/files/view/files.html'
//        }).when('/tasks/', {
//            controller : 'TaskController',
//            templateUrl : 'app/src/tasks/view/tasks.html'
//        })
//        .when('/organisations/', {
//          controller: 'OrganisationController',
//          templateUrl: 'app/src/organisations/view/organisations.html'
//>>>>>>> develop
//        })
//        .when('/organisations/organisation', {
//          controller: 'OrganisationController',
//          templateUrl: 'app/src/organisations/view/organisation.html'
//        })
//        .otherwise({
//          redirectTo: '/'
//        });
//
//        $translateProvider
//            .translations('en', en_translations)
//            .preferredLanguage('en');
//
//    }
    
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