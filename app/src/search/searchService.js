
    angular
        .module('openeApp')
        .factory('searchService', searchService);

    function searchService($http) {

        var service = {};

        var Alfresco = {
            apiProxyUrl : '/alfresco/service/api/',
            openesdhApiProxyUrl : '/alfresco/service/api/openesdh/',
            slingshotProxyUrl : '/alfresco/service/slingshot/'
        };

        //<editor-fold desc="liveSearch results">
        service.liveSearchCaseDocs = function (term) {
            //return $http.get('/alfresco/service/openesdh/live-search-caseDocs?t=' + term);
            return $http.get('/alfresco/service/api/openesdh/live-search/caseDocs?t=' + term);
        };

        service.liveSearchCases = function (term) {
            //return $http.get('/alfresco/service/openesdh/live-search-cases?t='+ term);
            return $http.get('/alfresco/service/api/openesdh/live-search/cases?t='+ term);
        };

        service.liveSearchDoTemplates = function (term) {
            //return $http.get('/alfresco/service/openesdh/live-search-cases?t='+ term);
            return $http.get('/alfresco/service/api/openesdh/live-search/templates?t='+ term);
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
            return $http.get(Alfresco.slingshotProxyUrl+'search?'+ term).then(function(response) {
                return response.data;
            });
        };

        /**
         * This returns the list of facets configured in the repository for use with the returned results
         */
        service.getConfiguredFacets = function () {
            return $http.get(Alfresco.apiProxyUrl+"facet/facet-config").then(function(response){
                 var rawFacets = response.data.facets;
                 var facets=[];
                 rawFacets.forEach(function(facet){
                     if (facet.isEnabled){
                         facets.push(facet)
                     }
                 });
                 return rawFacets;
            });
        };

        service.findPersons = function (searchTerm) {
            var url = Alfresco.apiProxyUrl + 'people';
            if(searchTerm && searchTerm.length > 0){
                url += searchTerm;
            }
            url +="?sortBy=lastName&dir=asc&filter=*&maxResults=250";

            return $http.get(url).then(function(result){
                return result.data.people;
            });
        };

        service.executeContextualSearch =  function(context, searchTerm){
            var url = Alfresco.openesdhApiProxyUrl+getContextURL(context);
            url += searchTerm;

            return $http.get(url).then(function(response){
                return response.data;
            });
        };

        function getContextURL(context){
            return context[context].searchAPIUrl;
        }

        return service;
    }