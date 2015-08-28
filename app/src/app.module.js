(function() {

  angular
    .module('openeApp', ['ngMaterial', 'ngRoute', 'cases', 'dashboard', 'files', 'tasks', 'documents', 'notes'])
    .config(function($mdThemingProvider, $routeProvider){

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

      $routeProvider
        .when('/', {
          controller: 'DashboardController',
          templateUrl: 'src/dashboard/view/dashboard.html'
        })
        .when('/cases/', {
          controller: 'CaseController',
          templateUrl: 'src/cases/view/cases.html'
        })
        .when('/cases/case', {
          controller: 'CaseController',
          templateUrl: 'src/cases/view/case.html'
        })
        .when('/files/', {
          controller: 'FileController',
          templateUrl: 'src/files/view/files.html'
        })
        .when('/tasks/', {
          controller: 'TaskController',
          templateUrl: 'src/tasks/view/tasks.html'
        })
        .otherwise({
          redirectTo: '/'
        });

  });

})();