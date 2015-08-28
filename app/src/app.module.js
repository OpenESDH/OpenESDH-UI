(function() {

  angular
//    .module('openeApp', ['ngMaterial', 'ngRoute', 'cases', 'dashboard', 'files', 'tasks', 'documents', 'notes', 'authController'])
    .module('openeApp', ['ngMaterial', 'ngRoute'])
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
        .when('/cases/', {
          controller: 'CaseController',
          templateUrl: 'app/src/cases/view/cases.html'
        })
        .when('/cases/case', {
          controller: 'CaseController',
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
        .otherwise({
          redirectTo: '/'
        });

  }

})();