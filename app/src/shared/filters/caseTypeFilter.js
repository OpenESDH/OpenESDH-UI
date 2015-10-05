(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('caseType', caseTypeFilterFactory);

    caseTypeFilterFactory.$inject = ['$translate'];
    
    function caseTypeFilterFactory($translate){
        function caseTypeFilter(type) {
            if (typeof type === 'undefined') {
                return "";
            }
            return $translate.instant('CASE.TYPE.' + type.replace(":", "_"));
        }
        return caseTypeFilter;
    }
    
})();
    
