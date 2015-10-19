    
    angular
        .module('openeApp')
        .filter('docStatus', docStatusFilterFactory);
    
    function docStatusFilterFactory($translate){
        function docStatusFilter(docStatusValue) {
            return $translate.instant('DOCUMENT.STATUS.' + docStatusValue);
        }
        return docStatusFilter;
    }
