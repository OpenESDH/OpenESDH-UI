(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('countryCodeToName', countryCodeToNameFilter);
    
    countryCodeToNameFilter.$inject = ['$translate'];
    
    function countryCodeToNameFilter($translate){
        return function(countryCode) {
            return $translate.instant('COUNTRY.' + countryCode);
        };
    }
    
})();
    
