
    angular.module('openeApp.common.directives.filter')
        .directive('openeFilterSearch', FilterSearchDirective);

    /**
     * This controller is a component controller for selecting a search filter for now it contains a select options
     * drop down and an additional input field to a combination of which will restrict search by a filter attribute
     * vector.
     *
     * For the sake of convenience it is recommended that the selectOptions variable (this is used to populate the
     * select) is an object array of any sort with the 'optionLabel && optionValue' properties specifying which
     * properties of the object to use for labelling and values correspondingly so given an array of:
     * [
     * {testLabel:'Number 1', testValue: 1},
     * {testLabel:'Number 2', testValue: 2},
     * {testLabel:'Number 3', testValue: 3},
     * {testLabel:'Number 4', testValue: 4}
     * ];
     *
     * One could set the labels and values as: optionLabel="testLabel"; optionValue="testValue";
     *
     * @param $scope
     * @constructor
     */
    function FilterSearchDirective() {

        function postlink(scope, elem, attrs) {
            
            scope.searchFilter = scope.selectOptions[0].optionValue;
            scope.searchTerm = '';

            scope.constructQuery = function() {
                var query = "?sortBy=" + scope.searchFilter;
                query += '&dir=asc&filter=' + encodeURIComponent(scope.searchTerm) + '&maxResults=250';
                return scope.finished(query);
            }

        }

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                selectOptions: '=',
                finished: '='
            },
            templateUrl: '/app/src/common/directives/filtersearch/view/filtersearch.html'
        }
    }