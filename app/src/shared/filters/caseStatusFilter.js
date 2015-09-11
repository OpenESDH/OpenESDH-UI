(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('caseStatus', caseStatusFilterFactory);
    
    caseStatusFilterFactory.$inject = ['$translate'];
    
    function caseStatusFilterFactory($translate){
        function caseStatusFilter(caseStatusValue) {
            return $translate.instant('CASE.STATUS.' + caseStatusValue);
        }
        return caseStatusFilter;
    }
    
})();
    
