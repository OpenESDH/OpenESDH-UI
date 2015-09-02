(function () {

    angular
            .module('openeApp', ['ngMaterial', 'ngRoute', 'ngResource', 'pascalprecht.translate', 'isteven-multi-select',
                'openeApp.cases', 'openeApp.dashboard', 'openeApp.files', 'openeApp.tasks', 'openeApp.documents',
                'openeApp.notes', 'openeApp.organizations'])
            .config(config);

    config.$inject = ['$mdThemingProvider', '$routeProvider', '$translateProvider'];

    function config($mdThemingProvider, $routeProvider, $translateProvider) {

        $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('orange');

        $routeProvider.when('/', {
            controller: 'DashboardController',
            templateUrl: 'app/src/dashboard/view/dashboard.html'
        }).when('/login', {
            templateUrl: 'app/src/authentication/view/login.html'
        }).when('/logout', {
            templateUrl: 'app/src/authentication/view/logout.html'
        }).when('/cases/', {
            controller: 'CaseController',
            controllerAs: 'vm',
            templateUrl: 'app/src/cases/view/cases.html'
        }).when('/cases/case/:caseId', {
            controller: 'CaseInfoController',
            templateUrl: 'app/src/cases/view/case.html'
        }).when('/files/', {
            controller: 'FileController',
            templateUrl: 'app/src/files/view/files.html'
        }).when('/tasks/', {
            controller: 'TaskController',
            templateUrl: 'app/src/tasks/view/tasks.html'
        }).when('/organizations/', {
            controller: 'OrganizationController',
            controllerAs: 'vm',
            templateUrl: 'app/src/organizations/view/organizations.html'
        }).when('/organizations/organization/:storeProtocol/:storeIdentifier/:uuid/', {
            controller: 'OrganizationInfoController',
            templateUrl: 'app/src/organizations/view/organization.html'
        }).otherwise({
            redirectTo: '/'
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
        document: {
            status: {
                received: 'Received',
                distributed: 'Distributed',
                draft: 'Draft',
                'under-review': 'Under review',
                published: 'Published',
                finalised: 'Finalised',
                submitted: 'Submitted'
            },
            category: {
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
            type: {
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