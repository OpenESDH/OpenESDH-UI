angular.module('openeApp.common.directives.filter')
    .directive('openeListFilter', ListFilterDirective)
    .directive('openeColumnFilter', ColumnFilterDirective);

function ListFilterDirective($timeout) {

    function postlink(scope, elem, attrs) {

        scope.updateFilter = function(index) {
            scope.choice = scope.list[index];

            // Timeout angularfix to get scope to update properly
            $timeout(function() {
                return scope.finished();
            }, 10);
        }

    }

    return {
        link: postlink,
        restrict: 'E',
        scope: {
            list: '=',
            choice: '=',
            finished: '&finished'
        },
        templateUrl: 'app/src/common/directives/listFilter/view/listFilter.html'
    }
}

function ColumnFilterDirective() {

    function postlink(scope, elem, attr) {
        var arrayCb = [];
        scope.selectCheckbox = function(item) {
            var i = arrayCb.indexOf(item);
            if (i > -1) {
                arrayCb.splice(i, 1);
            } else {
                arrayCb.push(item);
            }
            scope.filter[scope.value] = arrayCb;
        }
    }

    return {
        link: postlink,
        restrict: 'E',
        scope: {
            type: '@',
            filter: '=',
            value: '@',
            list: '='
        },
        templateUrl: 'app/src/common/directives/listFilter/view/columnFilter.html'
    }
}
