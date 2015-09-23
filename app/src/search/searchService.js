(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('searchService', searchService);

    searchService.$inject = ['$http', '$resource'];

    function searchService($http, $resource) {

        var service = {};

        var Alfresco = {
            apiProxyUrl : '/alfresco/service/api/',
            slingshotProxyUrl : '/alfresco/service/slingshot/'
        };

        //<editor-fold desc="liveSearch results">
        service.liveSearchCaseDocs = function (term) {
            return $http.get('/alfresco/service/openesdh/live-search-caseDocs?t=' + term).then(function(response) {
                return response.data.documents;
            });
        };

        service.liveSearchCases = function (term) {
            return $http.get('/alfresco/service/openesdh/live-search-cases?t='+ term).then(function(response) {
                return response.data.cases;
            });
        };
        //</editor-fold>

        /**
         * Could we just use the live search results and return a concatenation of the results??
         * Thoughts: What about faceting?
         *
         * @param term
         * @returns {*}
         */
        service.search = function (term) {
            var encTerm = encodeURIComponent(JSON.stringify(term) );
            return $http.get(Alfresco.slingshotProxyUrl+'search?'+ encTerm).then(function(response) {
                return response.data;
            });
        };

        /**
         * This returns the list of facets configured in the repository for use with the returned results
         */
        service.getConfiguredFacets = function () {
             $http.get(Alfresco.apiProxyUrl+"facet/facet-config").then(function(response){
                 var rawFacets = JSON.parse(response).facets;
                 var facets=[];
                 rawFacets.forEach(function(facet){
                     if (facet.isEnabled()){
                         facets.push(facet)
                     }
                 });

                 return rawFacets;
            });
        };

        /**
         * This function is used to construct the search terms that are passed to a search service. The
         * terms provided by the user (e.g. the text that the user has typed) is parenthesized and concatonated
         * with any [hiddenSearchTerms]{@link module:alfresco/header/SearchBox#hiddenSearchTerms} so that the scope
         * of the user search request is not lost.
         *
         * @instance
         * @since 1.0.31
         * @overrideable
         */
        function generateSearchTerm (terms) {
            var searchTerm = terms;

                searchTerm = encodeURIComponent("(" + terms + ") ");

            return searchTerm;
        }

        service.findPersons = function (searchTerm) {
            var url = ALFRESCO_URI + '/people';
            if(searchTerm && searchTerm.length > 0){
                url += searchTerm;
            }
            url +="?sortBy=lastName&dir=asc&filter=*&maxResults=250";

            return $http.get(url).then(function(result){
                return result.data.people;
            });
        };

        return service;
    }
})();
