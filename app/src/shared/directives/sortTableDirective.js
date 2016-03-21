
    angular
        .module('openeApp')
        .directive('sortTable', sortTable);

    function sortTable($compile){
        function sortLink(scope, element, attrs){
            element
                .append('<i class="material-icons" ng-if="reverseOrder && sortType == \''+attrs.sortTable+'\'">keyboard_arrow_down</i>')
                .append('<i class="material-icons" ng-if="!reverseOrder && sortType == \''+attrs.sortTable+'\'">keyboard_arrow_up</i>');

            $compile(element.contents())(scope);

            if ('sortDefault' in attrs) {
                scope.orderByAttribute = attrs.sortTable;
                scope.reverseOrder = attrs.sortDefault=='reverse' ? true : false;
            }

            element.bind('click', function(element){
                scope.orderByAttribute = attrs.sortTable;
                scope.reverseOrder = !scope.reverseOrder;
                if (scope.sortType !== scope.orderByAttribute) {
                    scope.sortType = scope.orderByAttribute;
                    scope.reverseOrder = false;
                }

                scope.$apply();
            });
        }

        return {
            link: sortLink,
            // restrict: 'A',
            scope: false
        }
    }