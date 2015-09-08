(function(){
    'use strict';

    angular.module('openeApp.office').config(configure);

//    configure.$inject = ['$stateProvider', 'USER_ROLES'];
    configure.$inject = ['$stateProvider'];

//    function configure($stateProvider, USER_ROLES) {
    function configure($stateProvider) {
        console.log('in configure');

        $stateProvider.state('outlook', {
            url: '/outlook',
            views: {
                'content@': {
                    templateUrl: '/app/src/office/view/outlook.html',
                    controller: 'OfficeController',
                    controllerAs: 'vm'
                }
            },
            data: {
//                authorizedRoles: [USER_ROLES.user]
                authorizedRoles: ['user']
            }
        });
    }
})();
