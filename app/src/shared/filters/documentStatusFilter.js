(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('docStatus', docStatusFilterFactory);
    
    docStatusFilterFactory.$inject = ['$translate'];
    
    function docStatusFilterFactory($translate){
        function docStatusFilter(docStatusValue) {
            return $translate.instant('DOCUMENT.STATUS.' + docStatusValue);
        }
        return docStatusFilter;
    }
    
})();
    
