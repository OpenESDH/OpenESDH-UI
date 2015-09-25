(function () {
    'use strict';
    angular
        .module('openeApp.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = [
        '$scope',
        '$state',
        'searchService'
    ];

    /**
     * Main Controller for the Search module
     * @param $scope
     * @constructor
     */
    function SearchController($scope, $state, searchService) {

        var vm = this;
        vm.liveSearchResults = {
            cases    : null,
            documents: null
        };
        vm.fullSearchResults = null;
        vm.searchTerm = '';

        //<editor-fold desc="Live search methods">
        vm.getLiveSearchResults = function (term) {
            if (term.length === 0) return;

            casesLiveSearch(term);
            caseDocsLiveSearch(term);
        };

        vm.showSuggestions = function () {
            if (vm.searchTerm.length > 0) return true;
            return false;
        };

        function caseDocsLiveSearch(term) {
            searchService.liveSearchCaseDocs(term).then(function (res) {
                vm.liveSearchResults.documents = res.data.documents;
            });
        }

        function casesLiveSearch(term) {
            searchService.liveSearchCases(term).then(function (res) {
                vm.liveSearchResults.cases = res.data.cases;
            });
        }

        //</editor-fold>

        /**
         * This function is meant to be called to redirect user to the search page
         */
        function gotoSearchPage() {
            $state.go('searchPage');
        }

        /**
         * Executes the main search function to search for cases and case documents in the repository
         * @param term
         */
        function executeSearch(term) {

            var queryObj = {
                facetFields: searchService.getConfiguredFacets(),
                filters    : "",
                maxResults : 0,
                noCache    : new Date().getTime(),
                pageSize   : 25,
                query      : "",
                repo       : true,
                rootNode   : "openesdh://cases/home",
                site       : "",
                sort       : "",
                spellcheck : true,
                startIndex : 0,
                tag        : "",
                term       : term
            };
            var searchResults = searchService.search(queryObj);

            if (searchResults.numberFound > 0)
                vm.fullSearchResults = {
                    results          : searchResults.items, //An array of objects
                    facets           : searchResults.facets,//An array of objects
                    totalRecords     : searchResults.totalRecords, //Rest of these are integer values
                    totalRecordsUpper: searchResults.totalRecordsUpper,
                    numberFound      : searchResults.numberFound
                }
        }
    }

})();
