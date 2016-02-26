
    angular
        .module('openeApp')
        .directive('appHeader', HeaderDirective);

    function HeaderDirective() {

        function postlink(scope, elem, attr) {
            scope.toState = scope.$root.toState.name;
        }

        return {
            link       : postlink,
            restrict   : 'E',
            scope      : {},
            templateUrl: 'app/src/header/view/header.html'
        };
    }