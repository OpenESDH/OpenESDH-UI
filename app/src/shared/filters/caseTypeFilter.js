    
    angular
        .module('openeApp')
        .filter('caseType', caseTypeFilterFactory);
    
    function caseTypeFilterFactory($translate){
        function caseTypeFilter(type) {
            if (typeof type === 'undefined') {
                return "";
            }
            return $translate.instant(type.replace(":", "_").toUpperCase() + '.TYPE');
        }
        return caseTypeFilter;
    }