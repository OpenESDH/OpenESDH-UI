(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('docState', docStateFilterFactory);
    
    docStateFilterFactory.$inject = ['$translate'];
    
    function docStateFilterFactory($translate){
        function docStateFilter(docStateValue) {
            return $translate.instant('document.state.' + docStateValue);
        }
        return docStateFilter;
    }
    
})();
    
