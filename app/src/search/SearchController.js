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

        var sctrl = this;
        $scope.fullSearchResults = null;
        sctrl.queryResult = null;
        sctrl.executeSearch = executeSearch;
        sctrl.searchTerm = "";
        sctrl.definedFacets = null;

        //</editor-fold>

        /**
         * This function is meant to be called to redirect user to the search page
         */
        function gotoSearchPage() {
            $state.go('search');
        }

        /**
         * Executes the main search function to search for cases and case documents in the repository
         * @param term
         */
        function executeSearch(term) {
            sctrl.definedFacets = searchService.getConfiguredFacets();//executes query out of step

            var queryObj = {
                facetFields: sctrl.definedFacets,
                filters: "",
                maxResults: 0,
                noCache: new Date().getTime(),
                pageSize: 25,
                query: "",
                repo: true,
                rootNode: "openesdh://cases/home",
                site: "",
                sort: "",
                spellcheck: true,
                startIndex: 0,
                tag: "",
                term: term
            };
            var objQuerified = objectToQuery(queryObj);

            sctrl.queryResult = getSearchQuery(objQuerified);

            if (sctrl.queryResult.numberFound > 0)
                $scope.fullSearchResults = {
                    results: sctrl.queryResult.items, //An array of objects
                    facets: sctrl.queryResult.facets,//An array of objects
                    totalRecords: sctrl.queryResult.totalRecords, //Rest of these are integer values
                    totalRecordsUpper: sctrl.queryResult.totalRecordsUpper,
                    numberFound: sctrl.queryResult.numberFound
                };
            gotoSearchPage();
        }

        function getSearchQuery(query){
            return searchService.search(query);
        }

        /**
         * summary:
         *		takes a name/value mapping object and returns a string representing
         *		a URL-encoded version of that object.
         * example:
         *		this object:
         *	{
         *		blah: "blah",
         *		multi: [
         *			"thud",
         *			"thonk"
         *	    ]
         *	};
         *
         *	yields the following query string: "blah=blah&multi=thud&multi=thonk"
         *
         * credit to alfresco Aikau developers.
         * @param map
         * @returns {string}
         */
        function objectToQuery(map) {
            // FIXME: need to implement encodeAscii!!
            var enc = encodeURIComponent, pairs = [];
            for (var name in map) {
                var value = map[name];
                var assign = enc(name) + "=";
                if (Array.isArray(value)) {
                    for (var i = 0, l = value.length; i < l; ++i) {
                        pairs.push(assign + enc(value[i]));
                    }
                } else {
                    pairs.push(assign + enc(value));
                }
            }
            return pairs.join("&"); // String
        }
    }

})();
