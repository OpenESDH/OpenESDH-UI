(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('docType', docTypeFilterFactory);
    
    docTypeFilterFactory.$inject = ['$translate'];
    
    function docTypeFilterFactory($translate){
        function docTypeFilter(docTypeValue) {
            return $translate.instant('document.type.' + docTypeValue);
        }
        return docTypeFilter;
    }
    
})();
    
