
    angular
        .module('openeApp')
        .directive('appHeader', HeaderDirective);

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