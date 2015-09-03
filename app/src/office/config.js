(function(){
    'use strict';

    var module = angular.module('openeApp.office');
    module.config(configure);
    console.log(module);

    configure.$inject = ['$stateProvider'];

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
                authorizedRoles: [USER_ROLES.user]
            }
        });
    }
})();
