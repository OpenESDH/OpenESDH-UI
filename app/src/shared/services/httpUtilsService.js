(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('httpUtils', httpUtils);

    function httpUtils() {
        var service = {
            parseResponseContentRange: parseResponseContentRange,
            setXrangeHeader: setXrangeHeader 
        };
        return service;

        function parseResponseContentRange(response) {
            var contentRange = response.headers("content-range");
            var matches = /items (\d+)-(\d+)\/(\d+)/.exec(contentRange);
            return {totalItems: matches[3], startIndex: matches[1], endIndex: matches[2]};
        }
        
        function setXrangeHeader(requestConfig, page, pageSize){
            if(page != 'undefined' && pageSize != 'undefined'){
                var startIndex = (page - 1) * pageSize;
                var resultEnd = (startIndex + pageSize);
                requestConfig.headers = {'x-range': 'items=' + startIndex + '-' + resultEnd};
            }
            return requestConfig;
        }
    }
})();
