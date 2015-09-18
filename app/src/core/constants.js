(function(){
    'use strict';

    angular
        .module('openeApp.core')
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        });
})();