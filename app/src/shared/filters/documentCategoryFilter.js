(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('docCategory', docCategoryFilterFactory);
    
    docCategoryFilterFactory.$inject = ['$translate'];
    
    function docCategoryFilterFactory($translate){
        function docCategoryFilter(docCategoryValue) {
            return $translate.instant('DOCUMENT.CATEGORY.' + docCategoryValue);
        }
        return docCategoryFilter;
    }
    
})();
    
