    
    angular
        .module('openeApp')
        .filter('countryCodeToName', countryCodeToNameFilter);
    
    function countryCodeToNameFilter($translate){
        return function(countryCode) {
            return $translate.instant('COUNTRY.' + countryCode);
        };
    }