(function(){
    'use strict';

    angular.module('openeApp.search.component.filter')
        .controller('SearchFilterComponent', SearchFilterComponent);

    SearchFilterComponent.$inject = ['$scope', 'searchService'];

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
    function SearchFilterComponent($scope, searchService) {
        $scope.init = function(label, value, options, callback ){
            $scope.optionLabel = label;
            $scope.optionValue = value;
            $scope.selectOptions = options;
            $scope.searchFilter ="userName";
            $scope.searchTerm = "*";
            $scope.callback = callback;
        };

        var sfc = this;
        sfc.constructQuery = constructQuery;

        //debugger;

        function constructQuery(){
            var query ="sortBy="+$scope.searchFilter+"&dir=asc&filter="+encodeURIComponent($scope.searchTerm)+"&maxResults=250";
            debugger;
            return searchService[$scope.callback](query);
        }
    }
})();