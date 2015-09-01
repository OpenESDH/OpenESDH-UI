(function() {

  angular
    .module('openeApp', [
        'ngMaterial',
        'ngRoute',
        'ui.router',
        'ngResource',
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
        user: 'user'
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

  config.$inject = ['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', 'USER_ROLES'];

  function config($mdThemingProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {
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
  }
  function config2($mdThemingProvider, $routeProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

      $routeProvider
        .when('/', {
          controller: 'DashboardController',
          templateUrl: 'app/src/dashboard/view/dashboard.html'
        })
        .when('/login', {
          controller: 'LoginController',
          controllerAs: 'vm',
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
        .otherwise({
          redirectTo: '/'
        });

  }

})();