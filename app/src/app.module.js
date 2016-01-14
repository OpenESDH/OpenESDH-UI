
    angular
        .module('openeApp', [
            'ngSanitize',
            'ngMaterial',
            'ngMessages',
            'material.wizard',
            'ui.router',
            'rt.encodeuri',
            'ngResource',
            'pdf',
            'swfobject',
            'isteven-multi-select',
            'openeApp.translations.init',
            'openeApp.cases',
            'openeApp.cases.members',
            'openeApp.cases.parties',
            'openeApp.classification',
            'openeApp.dashboard',
            'openeApp.files',
            'openeApp.tasks',
            'openeApp.documents',
            'openeApp.notes',
            'openeApp.contacts',
            'openeApp.administration',
            'openeApp.office',
            'openeApp.officeTemplates',
            'openeApp.groups',
            'openeApp.users',
            'openeApp.workflows',
            'openeApp.systemsettings',
            'openeApp.search',
            'openeApp.common.directives',
            'openeApp.common.directives.filter',
            'm43nu.auto-height',
            'dcbImgFallback',
            'openeApp.activities',
/*DO NOT REMOVE MODULES PLACEHOLDER!!!*/ //opene-modules
            /*LAST*/ 'openeApp.translations'])// TRANSLATIONS IS ALWAYS LAST!
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
        .config(config)
        .run(function ($rootScope, $state, $stateParams, $mdDialog, authService, sessionService, ContextService) {
            $rootScope.$on('$stateChangeStart', function (event, next, params) {
                $rootScope.toState = next;
                $rootScope.toStateParams = params;
                if (next.data.authorizedRoles.length === 0) {
                    return;
                }
                
                if (authService.isAuthenticated() && authService.isAuthorized(next.data.authorizedRoles)) {
                    //We do nothing. Attempting to transition to the actual state results in call stack exception
                } else {
                    event.preventDefault();
                    sessionService.retainCurrentLocation();
                    $state.go('login');
                }

                // If we got any open dialogs, close them before route change
                $mdDialog.cancel();

                // Clear context
                ContextService.clearContext();
            });
        });

    function config($mdThemingProvider, $stateProvider, $urlRouterProvider, USER_ROLES, $mdIconProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue', {
                'default': '600',
                'hue-1': '400',
                'hue-2': '800',
                'hue-3': '900'
            })
            .accentPalette('amber')
            .warnPalette('deep-orange');

        $mdIconProvider.icon('md-calendar', '/app/assets/img/icons/today.svg');

        $urlRouterProvider
            .when('/cases/case/:caseId','/cases/case/:caseId/info')
            .when('/admin/system-settings','/admin/system-settings/general-configuration')
            .otherwise('/');

        $stateProvider.state('site', {
            abstract: true,
            resolve: {
                authorize: ['authService', function (authService) {
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
                    controller: 'CaseListController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('case', {
            parent: 'site',
            url: '/cases/case/:caseId',
            views: {
                'content@': {
                    templateUrl: '/app/src/cases/view/case.html',
                    controller: 'CaseController',
                    controllerAs: 'caseCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 0
            }
        }).state('case.info', {
            url: '/info',
            views: {
                'caseInfo': {
                    templateUrl: '/app/src/cases/view/case_info.html',
                    controller: 'CaseInfoController',
                    controllerAs: 'civm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 0
            }
        }).state('case.notes', {
            url: '/notes',
            views: {
                'caseNotes': {
                    templateUrl: '/app/src/notes/view/caseNotes.html',
                    controller: 'NoteController',
                    controllerAs: 'caseNotes'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 1
            }
        }).state('case.members', {
            url: '/members',
            views: {
                'caseMembers': {
                    templateUrl: 'app/src/case_members/view/caseMembers.html',
                    controller: 'CaseMembersController',
                    controllerAs: 'cmc'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 2
            }
        }).state('case.parties', {
            url: '/parties',
            views: {
                'caseParties': {
                    templateUrl: 'app/src/parties/view/caseParties.html',
                    controller: 'CasePartiesController',
                    controllerAs: 'cmCPC'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 3
            }
        }).state('case.history', {
            url: '/history',
            views: {
                'caseHistory': {
                    templateUrl: 'app/src/history/view/caseHistory.html',
                    controller: 'CaseHistoryController',
                    controllerAs: 'historyCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 4
            }
        }).state('case.tasks', {
            url: '/tasks',
            views: {
                'caseTasks': {
                    templateUrl: 'app/src/tasks/view/tasksDisplay.html',
                    controller: 'CaseTasksController',
                    controllerAs: 'tasksCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user],
                selectedTab: 5
            }
        }).state('docDetails', {
            parent: 'site',
            url: '/cases/case/:caseId/doc/:storeType/:storeId/:id',
            views: {
                'content@': {
                    controller: 'DocumentDetailsController',
                    templateUrl: 'app/src/documents/view/document.html',
                    controllerAs: 'docCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('login', {
            parent: 'site',
            url: '/login?error&nosso',
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
        }).state('tasks', {
            parent: 'site',
            url: '/tasks',
            views: {
                'content@': {
                    templateUrl: '/app/src/tasks/view/tasks.html',
                    controller: 'tasksOverviewController',
                    controllerAs: 'tasksCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('workflowtask', {
            parent: 'site',
            url: '/tasks/task/:taskName/:taskId',
            views: {
                'content@': {
                    templateUrl : '/app/src/tasks/common/view/taskContainer.html',
                    controller : 'taskFormLoaderController',
                    controllerAs: 'ctrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('administration', {
            parent: 'site',
            url: '/admin',
            views: {
                'content@': {
                    templateUrl: '/app/src/admin/view/admin.html',
                    controller: 'AdminController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.admin],
                selectedTab: 0
            }
        }).state('administration.users', {
            url: '/users',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                selectedTab: 0
            },
            views: {
                'users': {
                    templateUrl: '/app/src/users/view/users.html'
                }
            }
        }).state('administration.groups', {
            url: '/groups',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                selectedTab: 1
            },
            views: {
                'groups': {
                    templateUrl: '/app/src/groups/view/groups.html'
                }
            }
        }).state('administration.group', {
            url: '/group/:shortName',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                searchContext: 'GROUPS',
                selectedTab: 1
            },
            views: {
                'groups': {
                    templateUrl: '/app/src/groups/view/group.html'
                }
            }
        }).state('administration.organizations', {
            url: '/organizations',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                searchContext: 'CONTACT_ORGANISATIONS',
                selectedTab: 2
            },
            views: {
                'organizations': {
                    templateUrl: '/app/src/contacts/view/organizations.html'
                }
            }
        }).state('administration.organization', {
            url: '/organization/:storeProtocol/:storeIdentifier/:uuid',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                selectedTab: 2
            },
            views: {
                'organizations': {
                    templateUrl: '/app/src/contacts/view/organization.html'
                }
            }
        }).state('administration.contacts', {
            url: '/contacts',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                searchContext: 'CONTACT_USERS',
                selectedTab: 3
            },
            views: {
                'contacts': {
                    templateUrl: '/app/src/contacts/view/persons.html'
                }
            }
        }).state('administration.systemsettings', {
            url: '/system-settings',
            data: {
                authorizedRoles: [USER_ROLES.admin],
                selectedTab: 4
            },
            views: {
                'systemsettings': {
                    templateUrl: '/app/src/system_settings/menu/system_settings.html',
                    controller: 'SystemsettingsController',
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
                    templateUrl: '/app/src/system_settings/general_configuration/view/generalConfiguration.html',
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
                    templateUrl: '/app/src/system_settings/document_types/view/documentTypes.html',
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
                    templateUrl: '/app/src/system_settings/document_categories/view/documentCategories.html',
                    controller: 'DocumentCategoriesController',
                    controllerAs: 'vm'
                }
            }
        }).state('administration.systemsettings.templates', {
            url: '/templates',
            views: {
                'systemsetting-view': {
                    templateUrl: '/app/src/officeTemplates/view/templates.html',
                    controller: 'OfficeTemplateController',
                    controllerAs: 'tmplCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('search', {
            url: '/search?query&ctx',
            views: {
                'content@': {
                    templateUrl: '/app/src/search/view/search.html'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        }).state('activities', {
            url: '/activities',
            views: {
                'content@': {
                    templateUrl: '/app/src/activities/view/activities.html',
                    controller: 'activitiesController',
                    controllerAs: 'actCtrl'
                }
            },
            data: {
                authorizedRoles: [USER_ROLES.user]
            }
        });
    }