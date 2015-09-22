(function(){
    'use strict';

    angular.module('openeApp.search.component.filter')
        .controller('SearchFilterComponent', SearchFilterComponent);

    SearchFilterComponent.$inject = ['$scope'];

    /**
     * Main Controller for the Search module
     * @param $scope
     * @constructor
     */
    function SearchFilterComponent($scope) {
        var sfc = this;
        sfc.performSearch = performSearch;
        
        $scope.optionLabel='optionLabel';
        $scope.optionValue='testValue';
        $scope.searchFilter="";

        $scope.selectOptions = [
            {testLabel:'Number 1', testValue: 1},
            {testLabel:'Number 2', testValue: 2},
            {testLabel:'Number 3', testValue: 3},
            {testLabel:'Number 4', testValue: 4}
        ];

        function performSearch(){
            alert($scope.searchFilter +" : "+ $scope.searchTerm);
        }
    }
});
