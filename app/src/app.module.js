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
            'openeApp.notes',
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
        $translateProvider
            .translations('en', en_translations)
            .translations('da', da_translations)
            .registerAvailableLanguageKeys(['en', 'da'], {
              'en_US': 'en',
              'en_UK': 'en',
              'da_DK': 'da'
            })
            .determinePreferredLanguage();
    }

    var en_translations = {
      HOME: 'Home',
      CASEINFO: {
        MYCASES: 'My cases',
        CASES: 'Cases',
        UNASSIGNEDCASES: 'Unassigned cases',
        ID: 'Case ID',
        TYPE: 'Type',
        TITLE: 'Case title',
        STATUS: 'Status',
        CREATEDBY: 'Created by',
        CREATED: 'Created',
        CASEOWNERS: 'Case owners',
        MODIFIED: 'Last modified',
        DESCRIPTION: 'Description',
        STARTDATE: 'Start date',
        ENDDATE: 'End date',
        ACTIONS: 'Actions',
        CREATENEWCASE: 'Create new case',
        VIEW: 'View',
        CASETYPESTANDARD: 'Standard case',
        CASETYPEOTHER: 'Other type of case'
      },
      document:{
        documents: 'Documents',
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
      },
      task: {
        tasks: 'Tasks'
      },
      search: {
        search: 'Search'
      },
      menu: {
        openmenu: 'Open menu',
        viewprofile: 'View profile',
        logout: 'Logout',
        login: 'Login'
      },
      login: {
        username: 'User name',
        password: 'Password',
        signmein: 'Sign me in automatically'
      }
    };
    
    var da_translations = {
      HOME: 'Min side',
      CASEINFO: {
        MYCASES: 'Mine sager',
        CASES: 'Sager',
        UNASSIGNEDCASES: 'Utildelte sager',
        ID: 'Sags-ID',
        TITLE: 'Sagstitel',
        TYPE: 'Type',
        STATUS: 'Status',
        CREATEDBY: 'Oprettet af',
        CREATED: 'Oprettet',
        CASEOWNERS: 'Sagsejer',
        MODIFIED: 'Sidst ændret',
        DESCRIPTION: 'Beskrivelse',
        STARTDATE: 'Startdato',
        ENDDATE: 'Slutdato',
        ACTIONS: 'Handlinger',
        CREATENEWCASE: 'Opret ny sag',
        VIEW: 'Vis',
        CASETYPESTANDARD: 'Standard-sag',
        CASETYPEOTHER: 'Anden type sag'
      },
      document:{
        documents: 'Dokumenter',
        status:{
          received: 'Modtaget',
          distributed: 'Distribueret',
          draft: 'Kladde',
          'under-review': 'Under godkendelse',
          published: 'Publiseret',
          finalised: 'Færdiggjort',
          submitted: 'Afsendt'
        },
        category:{
          annex: 'Annex',
          proof: 'Proof',
          contract: 'Kontrakt',
          note: 'Note',
          report: 'Rapport',
          proxy: 'Proxy',
          warranty: 'Garanti',
          part: 'Part',
          statement: 'Udtalelse',
          summary: 'Resumé',
          accounting: 'Regnskab',
          offers: 'Tilbud',
          other: 'Andre'
        },
        type:{
          invoice: 'Faktura',
          letter: 'Brev',
          note: 'Note',
          report: 'Rapport',
          agenda: 'Agenda',
          other: 'Andet'
        }
      },
      task: {
        tasks: 'Opgaver'
      },
      search: {
        search: 'Søg'
      },
      menu: {
        openmenu: 'Åben menu',
        viewprofile: 'Se profil',
        logout: 'Log ud',
        login: 'Log ind'
      },
      login: {
        username: 'Brugernavn',
        password: 'Kodeord',
        signmein: 'Automatisk log ind'
      }
    };
    
})();
