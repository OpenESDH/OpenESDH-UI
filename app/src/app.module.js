(function() {

  angular
    .module('openeApp', ['ngMaterial', 'ngRoute', 'ngResource', 'openeApp.cases', 'openeApp.dashboard', 'openeApp.files', 'openeApp.tasks', 'openeApp.documents', 'openeApp.notes', 'openeApp.organisations'])
    .config(config);

  config.$inject = ['$mdThemingProvider', '$routeProvider'];

  function config($mdThemingProvider, $routeProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

      $routeProvider
        .when('/', {
          controller: 'DashboardController',
          templateUrl: 'app/src/dashboard/view/dashboard.html'
        })
        .when('/login', {
          templateUrl: 'app/src/authentication/view/login.html'
        })
        .when('/logout', {
          templateUrl: 'app/src/authentication/view/logout.html'
        })
        .when('/cases/', {
          controller: 'CaseController',
          controllerAs: 'vm',
          templateUrl: 'app/src/cases/view/cases.html'
        })
        .when('/cases/case/:caseId', {
          controller: 'CaseInfoController',
          templateUrl: 'app/src/cases/view/case.html'
        })
        .when('/files/', {
          controller: 'FileController',
          templateUrl: 'app/src/files/view/files.html'
        })
        .when('/tasks/', {
          controller: 'TaskController',
          templateUrl: 'app/src/tasks/view/tasks.html'
        })
        .when('/organisations/', {
          controller: 'OrganisationController',
          templateUrl: 'app/src/organisations/view/organisations.html'
        })
        .when('/organisations/organisation', {
          controller: 'OrganisationController',
          templateUrl: 'app/src/organisations/view/organisation.html'
        })
        .otherwise({
          redirectTo: '/'
        });

  }

})();