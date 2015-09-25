(function () {
    'use strict';
    angular
        .module('openeApp.search')
        .controller('AutosuggestController', AutosuggestController);

    AutosuggestController.$inject = [
        '$scope',
        '$state',
        '$q',
        'searchService'
    ];

    /**
     * Main Controller for the Search module
     * @param $scope
     * @constructor
     */
    function AutosuggestController($scope, $state, $q, searchService) {

        var asctrl = this;
        asctrl.liveSearchResults = {
            cases: null,
            documents: null
        };
        asctrl.searchTerm = "";
        asctrl.definedFacets = null;

        asctrl.getLiveSearchResults = function (term) {
            if (term.length === 0) return;

            searchService.liveSearchCaseDocs(term).then(function (res) {
                asctrl.liveSearchResults.documents = res.data.documents;
            });
            searchService.liveSearchCases(term).then(function (res) {
                asctrl.liveSearchResults.cases = res.data.cases;
            });
        };

        /**
         * Returns a bool, if the suggestion box should be visible
         */
        asctrl.showSuggestions = function () {
            if (asctrl.searchTerm.length > 0) return true;
            return false;
        };

        /**
         * Return bool if the item is a document. 
         */
        asctrl.isDocument = function (item) {
            if(!item) return false;
            return item.hasOwnProperty('version');
        };

        /**
         * This function is meant to be called to redirect user to the search page
         */
        function gotoSearchPage() {
            $state.go('search');
        }

    }

})();
