(function () {
    'use strict';

    angular
        .module('openeApp')
        .directive('appHeader', HeaderDirective);

    //HeaderDirective.$inject = ['service'];

    function HeaderDirective() {

        function postlink(scope, elem, attr) {

        }

        return {
            link       : postlink,
            restrict   : 'E',
            scope      : {},
            templateUrl: 'app/src/header/view/header.html'
        };
    }

})();
