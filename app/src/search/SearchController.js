(function () {
    'use strict';
    angular
        .module('openeApp.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$stateParams', 'searchService'];

    /**
     * Main Controller for the Search module
     * @param $scope
     * @constructor
     */
    function SearchController($scope, $stateParams, searchService) {
        var sctrl = this;
        sctrl.searchTerm = $stateParams.searchTerm;
        sctrl.selectedFilters = {}; //Keep track of the selected filters
        sctrl.filtersQueryString=""; // the selected filters as query string
        sctrl.definedFacets = searchService.getConfiguredFacets();

        function initFacets(){
            searchService.getConfiguredFacets().then(function(data){
                sctrl.definedFacets = data;
                executeSearch();
            });
        }
        initFacets();

        /**
         * Executes the main search function to search for cases and case documents in the repository
         * @param term
         */
        function executeSearch() {

            var queryObj = {
                facetFields: parseFacetsForQueryFilter(),
                filters: sctrl.filtersQueryString, //"{http://www.alfresco.org/model/content/1.0}creator|abeecher"
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
                term: sctrl.searchTerm+'*'
            };
            var objQuerified = objectToQueryString(queryObj);
            getSearchQuery(objQuerified);
        }

        function getSearchQuery(query){

            searchService.search(query).then(function(response){
                sctrl.queryResult = response;
                if (response.numberFound > 0) {
                    sctrl.fullSearchResults = {
                        results: response.items, //An array of objects
                        facets: response.facets,//An array of objects
                        totalRecords: response.totalRecords, //Rest of these are integer values
                        totalRecordsUpper: response.totalRecordsUpper,
                        numberFound: response.numberFound
                    };
                    setActiveFacets();
                    // console.log("Facets: ", sctrl.fullSearchResults.facets)
                }
            });
        }

        function setActiveFacets() {
            // If object is empty
            if(Object.getOwnPropertyNames(sctrl.selectedFilters).length == 0) return;

            angular.forEach(sctrl.selectedFilters, function (value, key) {
                var facet = sctrl.fullSearchResults.facets[key];
                angular.forEach(facet, function (facetObject) {
                    if(facetObject.value === value) facetObject.selected = true;
                })
            })
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
        function objectToQueryString(map) {
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

        /**
         * Extracts the QName from each defined facet and 'stringifies' them for the query object
         * @returns {string}
         */
        function parseFacetsForQueryFilter(){
            var stringFacet="";
            sctrl.definedFacets.forEach(function(item){stringFacet ==""? stringFacet+= item.facetQName : stringFacet = stringFacet+','+item.facetQName});
            return stringFacet;
        }

        sctrl.filterResults = function(filterKey, filterValue) {
            //console.log("The filter value : "+ filterKey +" ==> "+filterValue);
            //selectedFilters is to be used to track what is checked then on every addition or removal, we rebuild the
            //filter query string and re-execute the search
            if(sctrl.selectedFilters[filterKey])
                delete (sctrl.selectedFilters[filterKey]);
            else
                sctrl.selectedFilters[filterKey] = filterValue;

            rebuildFilterQueryString();
        }

        function rebuildFilterQueryString(){
            //console.log("Rebuilding filter Query string");
            var filterQueryStringArr  = [];
            Object.keys(sctrl.selectedFilters).forEach(function(key){
                var bufStr = "";
                var value = sctrl.selectedFilters[key];
                //strip the @ at the start of the string just in case
                if(key.startsWith("@"))
                    bufStr = key.substring(1)+"|"+value;
                else
                    bufStr = key+"|"+value;

                filterQueryStringArr.push(bufStr);
            });

            sctrl.filtersQueryString = filterQueryStringArr.valueOf()[0];
            executeSearch();
        }

    }

})();
